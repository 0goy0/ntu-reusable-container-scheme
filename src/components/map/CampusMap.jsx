import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { W, H, NODES, EDGES, BUILDINGS, HALLS, GREENS, WATER, YOU, FLOORS } from '../../data/campus';
import { routeTo, freeOf, status, nearestFree } from '../../lib/routing';
import './CampusMap.css';

const clampN = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const clampW = w => clampN(w, 260, 1900);
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Level of detail: landmark and hall labels only appear once zoomed in past these widths (map units).
const LANDMARK_ZOOM = 1100;
const HALL_ZOOM = 820;
const CTRL_W = 56;   // width reserved on the right for the zoom buttons

const Icon = {
  search: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  plus: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  minus: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14" /></svg>,
  locate: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>,
  walk: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="2" /><path d="m9 20 3-6 3 3v4M7 12l3-4 4 1 2 4" /></svg>,
  pin: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
};

function Pin({ c, upp, k, selected, dim, onSelect, dragged }) {
  const free = freeOf(c);
  const [pulse, setPulse] = useState(false);
  const prev = useRef(c.stock);
  useEffect(() => {
    if (prev.current === c.stock) return undefined;
    prev.current = c.stock;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 700);
    return () => clearTimeout(t);
  }, [c.stock]);
  const cls = ['cmap-pin', selected && 'is-sel', dim && 'is-dim', pulse && 'is-pulse'].filter(Boolean).join(' ');
  return (
    <g
      className={cls}
      data-s={status(c).key}
      transform={`translate(${c.x} ${c.y}) scale(${upp * (selected ? 1 : k)})`}
      tabIndex={dim ? -1 : 0}
      role="button"
      aria-label={`${c.name}: ${free} return slots free, ${c.stock} containers to borrow`}
      onClick={() => { if (!dragged.current) onSelect(c.id); }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(c.id); } }}
    >
      <g className="cmap-pin-inner">
        <circle cx="0" cy="-27" r="15" className="cmap-pin-ring" />
        <path d="M0 0C-3-9-15-14-15-27a15 15 0 1 1 30 0C15-14 3-9 0 0Z" className="cmap-pin-body" />
        <circle cx="0" cy="-27" r="10.5" className="cmap-pin-dot" />
        <text x="0" y="-27" className="cmap-pin-num" textAnchor="middle" dominantBaseline="central">{free}</text>
      </g>
    </g>
  );
}

/**
 * MazeMap-style illustrative campus map.
 * Props: data (canteens with live stock), extraActions [{label(c), disabled(c), primary, run(c)}],
 *        compact (force phone layout), collapsed (hide the canteen list until the search box is used), onSelect(c).
 * Ref API: select(id, {route}), deselect(), nearest().
 */
const CampusMap = forwardRef(function CampusMap({ data, extraActions = [], compact: forceCompact = false, collapsed = false, onSelect }, ref) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const svgRef = useRef(null);
  const S = useRef({ cw: 1, ch: 1, compact: forceCompact });
  const vbRef = useRef({ x: 0, y: 0, w: W });
  const anim = useRef(0);
  const fitted = useRef(false);
  const drag = useRef(null);
  const dragged = useRef(false);
  const hintTimer = useRef(0);
  const dataRef = useRef(data);
  dataRef.current = data;

  const [size, setSize] = useState({ cw: 0, ch: 0 });
  const [vb, setVb] = useState(vbRef.current);
  const [selectedId, setSelectedId] = useState(null);
  const [routeFor, setRouteFor] = useState(null);
  const [floor, setFloor] = useState('All');
  const [query, setQuery] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [dragging, setDragging] = useState(false);
  const compact = forceCompact || (size.cw > 0 && size.cw < 640);

  // ---------- viewport helpers (read refs, so they are safe in rAF / observers) ----------
  const commit = v => { vbRef.current = v; setVb(v); };
  const ratio = () => S.current.ch / S.current.cw;
  const setCenter = ({ cx, cy, w }) => commit({ w, x: cx - w / 2, y: cy - (w * ratio()) / 2 });
  const clampView = v => {
    const ar = ratio();
    const cx = clampN(v.x + v.w / 2, 0, W), cy = clampN(v.y + (v.w * ar) / 2, 0, H);
    return { w: v.w, x: cx - v.w / 2, y: cy - (v.w * ar) / 2 };
  };
  const panelW = () => (collapsed ? 0 : panelRef.current?.offsetWidth || 0);
  // Keep targets clear of the side panel (desktop) or the bottom sheet (compact).
  const offsetView = v => {
    const { cw, ch, compact: cp } = S.current;
    const upp = v.w / cw;
    if (cp) v.cy += ch * 0.17 * upp;
    else v.cx -= ((panelW() + 20 - CTRL_W) / 2) * upp;
    return v;
  };
  const viewFor = (x0, y0, x1, y1, pad) => {
    const { cw, ch, compact: cp } = S.current;
    const aw = cp ? cw : Math.max(200, cw - panelW() - 20 - CTRL_W);
    const ah = cp ? ch * 0.66 : ch;
    const w = clampW(Math.max((x1 - x0) * (1 + pad) * cw / aw, (y1 - y0) * (1 + pad) * cw / ah));
    return offsetView({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w });
  };
  const cancelAnim = () => cancelAnimationFrame(anim.current);
  const animateTo = (target, ms = 650) => {
    cancelAnim();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 1;
    const v0 = vbRef.current;
    const from = { cx: v0.x + v0.w / 2, cy: v0.y + (v0.w * ratio()) / 2, w: v0.w };
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / ms), e = ease(t);
      setCenter({ cx: from.cx + (target.cx - from.cx) * e, cy: from.cy + (target.cy - from.cy) * e, w: from.w + (target.w - from.w) * e });
      if (t < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };

  // ---------- actions ----------
  const select = (id, { route = false } = {}) => {
    const c = dataRef.current.find(x => x.id === id);
    if (!c) return;
    setSelectedId(id);
    setRouteFor(route ? id : null);
    if (route) {
      const pts = routeTo(c).pts, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      animateTo(viewFor(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 0.45));
    } else {
      animateTo(offsetView({ cx: c.x, cy: c.y, w: 420 }));
    }
    onSelect?.(c);
  };
  const deselect = () => { setSelectedId(null); setRouteFor(null); };
  const nearest = () => {
    const n = nearestFree(dataRef.current);
    if (n) select(n.c.id, { route: true });
  };
  useImperativeHandle(ref, () => ({ select, deselect, nearest }));

  // ---------- size / fit ----------
  useLayoutEffect(() => {
    const el = rootRef.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      S.current = { cw: r.width, ch: r.height, compact: forceCompact || r.width < 640 };
      setSize({ cw: r.width, ch: r.height });
      if (!fitted.current) {
        fitted.current = true;
        // Phones open zoomed in on the central campus; larger screens show the whole map.
        if (S.current.compact) setCenter({ cx: 640, cy: 470, w: 760 });
        else setCenter(viewFor(30, 40, W - 30, H - 40, 0.02));
      } else {
        commit(clampView(vbRef.current));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceCompact]);

  // ---------- wheel zoom (Ctrl/⌘ + scroll so the page can still scroll past the map) ----------
  useEffect(() => {
    const svg = svgRef.current;
    const onWheel = e => {
      if (!e.ctrlKey && !e.metaKey) {
        setHint(true);
        clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => setHint(false), 1100);
        return;
      }
      e.preventDefault();
      cancelAnim();
      const r = svg.getBoundingClientRect(), v = vbRef.current, upp = v.w / r.width;
      const mx = v.x + (e.clientX - r.left) * upp, my = v.y + (e.clientY - r.top) * upp;
      const nw = clampW(v.w * Math.exp(e.deltaY * 0.0018)), k = nw / v.w;
      commit(clampView({ w: nw, x: mx - (mx - v.x) * k, y: my - (my - v.y) * k }));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- drag to pan (capture starts only after real movement, so pin clicks still work) ----------
  const onPointerDown = e => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, v: vbRef.current, id: e.pointerId, moved: false };
  };
  const onPointerMove = e => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      dragged.current = true;
      svgRef.current.setPointerCapture(e.pointerId);
      setDragging(true);
      cancelAnim();
    }
    const upp = d.v.w / S.current.cw;
    commit(clampView({ w: d.v.w, x: d.v.x - dx * upp, y: d.v.y - dy * upp }));
  };
  useEffect(() => {
    const end = e => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      drag.current = null;
      setDragging(false);
      setTimeout(() => { dragged.current = false; }, 0);
    };
    const closePanel = e => { if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false); };
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
    document.addEventListener('pointerdown', closePanel);
    return () => {
      removeEventListener('pointerup', end);
      removeEventListener('pointercancel', end);
      document.removeEventListener('pointerdown', closePanel);
      cancelAnimationFrame(anim.current);
    };
  }, []);

  const zoomBy = f => {
    const v = vbRef.current;
    animateTo({ cx: v.x + v.w / 2, cy: v.y + (v.w * ratio()) / 2, w: clampW(v.w * f) }, 300);
  };
  const changeFloor = f => {
    setFloor(f);
    const sel = dataRef.current.find(c => c.id === selectedId);
    if (sel && f !== 'All' && sel.level !== f) deselect();
  };

  // ---------- render ----------
  const { cw, ch } = size;
  const upp = cw ? vb.w / cw : 1;
  const pinK = clampN(760 / vb.w, 0.78, 1);   // pins shrink a little when zoomed out so clusters stay readable
  const vbH = cw ? (vb.w * ch) / cw : H;
  const selected = data.find(c => c.id === selectedId) || null;
  const route = routeFor && selected ? routeTo(selected) : null;
  const q = query.trim().toLowerCase();
  const list = data.filter(c => (floor === 'All' || c.level === floor) && (!q || c.name.toLowerCase().includes(q)));
  const rootCls = ['cmap', compact && 'cmap--compact', collapsed && !compact && 'cmap--collapsed', dragging && 'is-dragging', selected && 'has-card'].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={rootCls}>
      <svg
        ref={svgRef}
        className="cmap-svg"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vbH}`}
        role="group"
        aria-label="Illustrative NTU campus map. Each pin is a canteen return machine; press Enter on a pin for details."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <rect x={-3000} y={-3000} width={8000} height={8000} className="cmap-land" />
        {GREENS.map((g, i) => <ellipse key={`g${i}`} cx={g[0]} cy={g[1]} rx={g[2]} ry={g[3]} className="cmap-green" />)}
        {WATER.map((g, i) => <ellipse key={`w${i}`} cx={g[0]} cy={g[1]} rx={g[2]} ry={g[3]} className="cmap-water" />)}
        <g>
          {['cmap-road-case', 'cmap-road'].map(cls => EDGES.map(([a, b]) => (
            <line key={cls + a + b} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} className={cls} />
          )))}
        </g>
        <g>
          {BUILDINGS.map(b => <rect key={b.label} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r || 5} className="cmap-bldg" />)}
          {HALLS.map(b => <rect key={b.label} x={b.x} y={b.y} width={b.w} height={b.h} rx={4} className="cmap-bldg cmap-bldg--hall" />)}
          {data.map(c => <rect key={c.id} x={c.bldg.x} y={c.bldg.y} width={c.bldg.w} height={c.bldg.h} rx={5} className="cmap-bldg cmap-bldg--canteen" />)}
        </g>
        <g className="cmap-labels" textAnchor="middle" fontSize={(compact ? 10 : 11.5) * upp} strokeWidth={3 * upp}>
          {GREENS.filter(g => g[4]).map(g => <text key={g[4]} x={g[0]} y={g[1]} dominantBaseline="central" className="cmap-label-green">{g[4]}</text>)}
          {vb.w < (compact ? 800 : LANDMARK_ZOOM) && BUILDINGS.map(b => <text key={b.label} x={b.x + b.w / 2} y={b.y + b.h / 2} dominantBaseline="central">{b.label}</text>)}
          {vb.w < (compact ? 560 : HALL_ZOOM) && HALLS.map(b => <text key={b.label} x={b.x + b.w / 2} y={b.y + b.h / 2} dominantBaseline="central" className="cmap-label-hall">{b.label}</text>)}
          {data.map(c => (
            <text key={c.id} x={c.bldg.x + c.bldg.w / 2} y={c.bldg.y + c.bldg.h + 4 * upp} dominantBaseline="hanging" className="cmap-label-canteen">{c.short}</text>
          ))}
        </g>
        {route && (
          <g key={routeFor}>
            <polyline points={route.pts.join(' ')} className="cmap-route-case" strokeWidth={9 * upp} />
            <polyline points={route.pts.join(' ')} className="cmap-route" strokeWidth={5 * upp} style={{ '--len': route.len, strokeDasharray: route.len }} />
          </g>
        )}
        <g className="cmap-you" transform={`translate(${YOU.x} ${YOU.y}) scale(${upp})`}>
          <circle r="16" className="cmap-you-halo" />
          <circle r="7" className="cmap-you-dot" />
        </g>
        <g>
          {data.map(c => (
            <Pin key={c.id} c={c} upp={upp} k={pinK} selected={c.id === selectedId} dim={floor !== 'All' && c.level !== floor} onSelect={select} dragged={dragged} />
          ))}
        </g>
      </svg>

      <div ref={panelRef} className={`cmap-panel${panelOpen ? ' is-open' : ''}`} onFocus={() => setPanelOpen(true)}>
        <label className="cmap-search">
          {Icon.search}
          <input type="search" placeholder="Search canteens" aria-label="Search canteens" autoComplete="off" value={query}
            onChange={e => { setQuery(e.target.value); setPanelOpen(true); }} />
        </label>
        <button type="button" className="cmap-nearest" onClick={nearest}>{Icon.pin}<span>Nearest spot with space</span></button>
        <div className="cmap-list">
          {list.length ? list.map(c => {
            const s = status(c);
            return (
              <button type="button" key={c.id} className={`cmap-item${c.id === selectedId ? ' is-active' : ''}`}
                onClick={e => { select(c.id); setPanelOpen(false); if (compact) e.currentTarget.blur(); }}>
                <span className={`cmap-item-dot cmap-s-${s.key}`} />
                <span className="cmap-item-main"><b>{c.name}</b><small>{c.level} · {s.label}</small></span>
                <span className="cmap-item-num"><b>{freeOf(c)}</b><small>slots free</small></span>
              </button>
            );
          }) : <p className="cmap-empty">No canteens match.</p>}
        </div>
      </div>

      <div className="cmap-floors" role="group" aria-label="Floor">
        {FLOORS.map(f => <button type="button" key={f} aria-pressed={f === floor} onClick={() => changeFloor(f)}>{f}</button>)}
      </div>
      <div className="cmap-ctrls">
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(0.7)}>{Icon.plus}</button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1.4)}>{Icon.minus}</button>
        <button type="button" aria-label="Show my location" onClick={() => animateTo(offsetView({ cx: YOU.x, cy: YOU.y, w: 480 }))}>{Icon.locate}</button>
      </div>
      <button type="button" className="cmap-fab" onClick={nearest}>{Icon.pin}<span>Nearest with space</span></button>

      {selected && (() => {
        const s = status(selected), free = freeOf(selected), r = routeTo(selected);
        const pct = Math.round((selected.stock / selected.cap) * 100);
        const alt = s.key === 'full' ? nearestFree(data, selected.id) : null;
        return (
          <div className="cmap-card" key={selected.id}>
            <button type="button" className="cmap-card-x" aria-label="Close" onClick={deselect}>×</button>
            <div className="cmap-card-kicker">Level {selected.level} · {selected.spot}</div>
            <h4 className="cmap-card-title">{selected.name}</h4>
            <span className={`cmap-chip cmap-chip--${s.key}`}>{s.label}</span>
            <div className="cmap-stats">
              <div><b>{selected.stock}</b><span>containers to borrow</span></div>
              <div><b>{free}</b><span>return slots free</span></div>
            </div>
            <div className="cmap-bar" title={`${pct}% full`}><i className={`cmap-s-${s.key}`} style={{ width: `${pct}%` }} /></div>
            <div className="cmap-walk">{Icon.walk}<span>{r.mins} min walk · {r.metres} m from {YOU.label}</span></div>
            {alt && (
              <div className="cmap-alt">This machine is full. Nearest with space:
                <button type="button" onClick={() => select(alt.c.id, { route: true })}>{alt.c.name} · {alt.r.mins} min</button>
              </div>
            )}
            <div className="cmap-actions">
              {extraActions.map((a, i) => (
                <button type="button" key={i} className={`cmap-btn${a.primary ? ' cmap-btn--primary' : ''}`}
                  disabled={a.disabled?.(selected)} onClick={() => a.run(selected)}>
                  {typeof a.label === 'function' ? a.label(selected) : a.label}
                </button>
              ))}
              <button type="button" className={`cmap-btn${extraActions.length ? '' : ' cmap-btn--primary'}`}
                disabled={routeFor === selected.id} onClick={() => select(selected.id, { route: true })}>
                {routeFor === selected.id ? 'Route shown' : 'Directions'}
              </button>
            </div>
          </div>
        );
      })()}

      <div className={`cmap-hint${hint ? ' is-show' : ''}`}>Hold Ctrl and scroll to zoom the map</div>
      <div className="cmap-credit">Illustrative layout · not to scale</div>
      <div className="cmap-legend" aria-hidden="true">
        <span><i className="cmap-s-ok" />Space</span><span><i className="cmap-s-warn" />Almost full</span><span><i className="cmap-s-full" />Full</span>
      </div>
    </div>
  );
});

export default CampusMap;
