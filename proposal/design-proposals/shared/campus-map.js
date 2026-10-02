/* Stylised, MazeMap-inspired campus map for the ReBox proposal.
   Layout and machine locations are illustrative, not to scale.
   Usage: const map = CampusMap.create(element, { compact, live, extraActions, onSelect }); */
(function () {
  'use strict';

  const W = 1000, H = 700;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const M_PER_UNIT = 1.6;       // illustrative scale: 1000 map units ≈ 1.6 km
  const WALK_M_PER_MIN = 80;

  // Road network (nodes + edges) used for drawing and walking directions.
  const NODES = {
    A: [120, 340], B: [250, 180], C: [560, 105], D: [700, 120], E: [860, 220],
    F: [900, 400], G: [780, 560], H: [560, 620], I: [280, 580], J: [140, 470],
    K: [360, 330], L: [560, 330], M: [720, 330], N: [560, 470], O: [560, 210], P: [320, 455]
  };
  const EDGES = [
    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'I'],
    ['I', 'J'], ['J', 'A'], ['A', 'K'], ['K', 'L'], ['L', 'M'], ['M', 'F'], ['L', 'O'], ['O', 'C'],
    ['L', 'N'], ['N', 'H'], ['K', 'P'], ['P', 'I']
  ];

  // cap = machine slots, stock = clean containers inside (free return slots = cap - stock).
  const CANTEENS = [
    { id: 'nsfc', name: 'North Spine Food Court', short: 'North Spine FC', x: 455, y: 284, node: 'K', level: 'L1', spot: 'Beside the drinks stall', cap: 60, stock: 60, sim: false, bldg: { x: 370, y: 262, w: 170, h: 44 } },
    { id: 'ssfc', name: 'South Spine Food Court', short: 'South Spine FC', x: 660, y: 468, node: 'N', level: 'B1', spot: 'Next to the tray return', cap: 60, stock: 41, bldg: { x: 585, y: 445, w: 150, h: 48 } },
    { id: 'c2', name: 'Canteen 2', short: 'Canteen 2', x: 736, y: 200, node: 'D', level: 'L1', spot: 'Main entrance', cap: 40, stock: 22, bldg: { x: 705, y: 180, w: 62, h: 42 } },
    { id: 'c9', name: 'Canteen 9', short: 'Canteen 9', x: 821, y: 302, node: 'E', level: 'L1', spot: 'By the hand-wash sinks', cap: 40, stock: 35, bldg: { x: 790, y: 282, w: 62, h: 40 } },
    { id: 'c11', name: 'Canteen 11', short: 'Canteen 11', x: 801, y: 478, node: 'G', level: 'L1', spot: 'Beside the cashier', cap: 40, stock: 18, bldg: { x: 770, y: 458, w: 62, h: 40 } },
    { id: 'c13', name: 'Canteen 13', short: 'Canteen 13', x: 621, y: 195, node: 'O', level: 'L1', spot: 'Near the side exit', cap: 40, stock: 29, bldg: { x: 590, y: 175, w: 62, h: 40 } },
    { id: 'c16', name: 'Canteen 16', short: 'Canteen 16', x: 276, y: 250, node: 'B', level: 'L1', spot: 'Main entrance', cap: 40, stock: 12, bldg: { x: 245, y: 230, w: 62, h: 40 } },
    { id: 'nh', name: 'North Hill Food Court', short: 'North Hill FC', x: 931, y: 150, node: 'E', level: 'L2', spot: 'Top of the escalator', cap: 40, stock: 26, bldg: { x: 900, y: 130, w: 62, h: 40 } },
    { id: 'quad', name: 'Quad Café', short: 'Quad Café', x: 231, y: 470, node: 'P', level: 'L1', spot: 'Outside the café doors', cap: 30, stock: 25, bldg: { x: 200, y: 450, w: 62, h: 40 } }
  ];

  const BUILDINGS = [
    { x: 360, y: 420, w: 70, h: 60, r: 22, label: 'The Hive' },
    { x: 400, y: 350, w: 90, h: 40, label: 'Library' },
    { x: 430, y: 150, w: 80, h: 40, label: 'Admin' },
    { x: 600, y: 520, w: 80, h: 36, label: 'Sports Hall' },
    { x: 830, y: 590, w: 50, h: 30 }, { x: 880, y: 470, w: 44, h: 60 }, { x: 100, y: 220, w: 50, h: 34 },
    { x: 320, y: 600, w: 60, h: 34 }, { x: 760, y: 250, w: 44, h: 26 }, { x: 170, y: 380, w: 60, h: 40 },
    { x: 640, y: 380, w: 60, h: 34 }, { x: 300, y: 70, w: 70, h: 30 }, { x: 960, y: 300, w: 40, h: 60 }
  ];
  const GREENS = [[440, 545, 90, 45, 'Yunnan Garden'], [70, 620, 120, 70], [965, 640, 110, 80], [80, 100, 100, 70], [620, 40, 90, 30]];
  const WATER = [[680, 262, 45, 26]];
  const YOU = { x: 320, y: 455, node: 'P', label: 'The Hive' };
  const FLOORS = ['All', 'B1', 'L1', 'L2'];

  const ICON = {
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    locate: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    walk: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="m9 20 3-6 3 3v4M7 12l3-4 4 1 2 4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };

  function svgEl(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function htmlEl(tag, cls, html, parent) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const clampN = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const ADJ = {};
  EDGES.forEach(([a, b]) => { (ADJ[a] = ADJ[a] || []).push(b); (ADJ[b] = ADJ[b] || []).push(a); });

  function shortestPath(from, to) {
    const d = {}, prev = {}, done = new Set();
    Object.keys(NODES).forEach(k => { d[k] = Infinity; });
    d[from] = 0;
    for (;;) {
      let u = null;
      for (const k in d) if (!done.has(k) && (u === null || d[k] < d[u])) u = k;
      if (u === null || d[u] === Infinity || u === to) break;
      done.add(u);
      ADJ[u].forEach(v => {
        const nd = d[u] + dist(NODES[u], NODES[v]);
        if (nd < d[v]) { d[v] = nd; prev[v] = u; }
      });
    }
    const path = [to];
    let c = to;
    while (c !== from) { c = prev[c]; if (c === undefined) return [from, to]; path.unshift(c); }
    return path;
  }

  function routeTo(c) {
    const pts = [[YOU.x, YOU.y]].concat(shortestPath(YOU.node, c.node).map(n => NODES[n]), [[c.x, c.y]]);
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += dist(pts[i - 1], pts[i]);
    const m = len * M_PER_UNIT;
    return { pts, len, metres: Math.round(m / 10) * 10, mins: Math.max(1, Math.round(m / WALK_M_PER_MIN)) };
  }

  const freeOf = c => c.cap - c.stock;
  function status(c) {
    const free = freeOf(c);
    if (free <= 0) return { key: 'full', label: 'Full, return elsewhere' };
    if (free / c.cap < 0.2) return { key: 'warn', label: 'Almost full' };
    return { key: 'ok', label: 'Space to return' };
  }

  function create(root, opts) {
    opts = Object.assign({ compact: false, live: true, extraActions: [], onSelect: null }, opts || {});
    const data = CANTEENS.map(c => Object.assign({}, c));
    const byId = {};
    data.forEach(c => { byId[c.id] = c; });
    const listeners = [];
    let selectedId = null, routeFor = null, floor = 'All', dragged = false, anim = 0, visible = true, fitted = false;
    const vb = { x: 0, y: 0, w: W, h: H };

    root.classList.add('cmap');
    root.innerHTML = '';
    const isCompact = () => root.classList.contains('cmap--compact');

    // ---------- SVG map ----------
    const svg = svgEl('svg', { class: 'cmap-svg', role: 'img', 'aria-label': 'Illustrative campus map showing canteens with container return machines' }, root);
    svgEl('rect', { x: -3000, y: -3000, width: 7000, height: 7000, class: 'cmap-land' }, svg);
    const gGreen = svgEl('g', {}, svg);
    GREENS.forEach(g => svgEl('ellipse', { cx: g[0], cy: g[1], rx: g[2], ry: g[3], class: 'cmap-green' }, gGreen));
    WATER.forEach(g => svgEl('ellipse', { cx: g[0], cy: g[1], rx: g[2], ry: g[3], class: 'cmap-water' }, gGreen));
    const gRoads = svgEl('g', {}, svg);
    ['cmap-road-case', 'cmap-road'].forEach(cls => EDGES.forEach(([a, b]) => svgEl('line', {
      x1: NODES[a][0], y1: NODES[a][1], x2: NODES[b][0], y2: NODES[b][1], class: cls
    }, gRoads)));
    const gB = svgEl('g', {}, svg);
    BUILDINGS.forEach(b => svgEl('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: b.r || 5, class: 'cmap-bldg' }, gB));
    data.forEach(c => svgEl('rect', { x: c.bldg.x, y: c.bldg.y, width: c.bldg.w, height: c.bldg.h, rx: 5, class: 'cmap-bldg cmap-bldg--canteen' }, gB));

    const gLabels = svgEl('g', { class: 'cmap-labels', 'text-anchor': 'middle' }, svg);
    BUILDINGS.filter(b => b.label).forEach(b => {
      svgEl('text', { x: b.x + b.w / 2, y: b.y + b.h / 2, 'dominant-baseline': 'central' }, gLabels).textContent = b.label;
    });
    GREENS.filter(g => g[4]).forEach(g => {
      svgEl('text', { x: g[0], y: g[1], 'dominant-baseline': 'central', class: 'cmap-label-green' }, gLabels).textContent = g[4];
    });
    data.forEach(c => {
      svgEl('text', { x: c.bldg.x + c.bldg.w / 2, y: c.bldg.y + c.bldg.h + 4, 'dominant-baseline': 'hanging', class: 'cmap-label-canteen' }, gLabels).textContent = c.short;
    });

    const routeCase = svgEl('polyline', { class: 'cmap-route-case', points: '' }, svg);
    const route = svgEl('polyline', { class: 'cmap-route', points: '' }, svg);

    const you = svgEl('g', { class: 'cmap-you' }, svg);
    svgEl('circle', { r: 16, class: 'cmap-you-halo' }, you);
    svgEl('circle', { r: 7, class: 'cmap-you-dot' }, you);

    const gPins = svgEl('g', {}, svg);
    const pinEls = {};
    data.forEach(c => {
      const g = svgEl('g', { class: 'cmap-pin', tabindex: 0, role: 'button', 'aria-label': c.name }, gPins);
      const inner = svgEl('g', { class: 'cmap-pin-inner' }, g);
      svgEl('circle', { cx: 0, cy: -27, r: 15, class: 'cmap-pin-ring' }, inner);
      svgEl('path', { d: 'M0 0C-3-9-15-14-15-27a15 15 0 1 1 30 0C15-14 3-9 0 0Z', class: 'cmap-pin-body' }, inner);
      svgEl('circle', { cx: 0, cy: -27, r: 10.5, class: 'cmap-pin-dot' }, inner);
      const t = svgEl('text', { x: 0, y: -27, class: 'cmap-pin-num', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, inner);
      g.addEventListener('click', () => { if (!dragged) select(c.id); });
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(c.id); } });
      pinEls[c.id] = { g, t };
    });

    // ---------- HTML overlays ----------
    const panel = htmlEl('div', 'cmap-panel', null, root);
    const search = htmlEl('label', 'cmap-search', ICON.search + '<input type="search" placeholder="Search canteens" aria-label="Search canteens" autocomplete="off">', panel);
    const input = search.querySelector('input');
    const nearestBtn = htmlEl('button', 'cmap-nearest', ICON.spark + '<span>Nearest spot with space</span>', panel);
    const list = htmlEl('div', 'cmap-list', null, panel);

    const floors = htmlEl('div', 'cmap-floors', FLOORS.map(f => `<button type="button" data-floor="${f}" aria-pressed="${f === floor}">${f}</button>`).join(''), root);
    const ctrls = htmlEl('div', 'cmap-ctrls', `<button type="button" data-z="in" aria-label="Zoom in">${ICON.plus}</button><button type="button" data-z="out" aria-label="Zoom out">${ICON.minus}</button><button type="button" data-z="me" aria-label="Show my location">${ICON.locate}</button>`, root);
    const fab = htmlEl('button', 'cmap-fab', ICON.spark + '<span>Nearest with space</span>', root);
    const card = htmlEl('div', 'cmap-card', null, root);
    card.hidden = true;
    const hint = htmlEl('div', 'cmap-hint', 'Hold Ctrl and scroll to zoom the map', root);
    htmlEl('div', 'cmap-credit', 'Illustrative layout · not to scale', root);
    const legend = htmlEl('div', 'cmap-legend', '<span><i class="cmap-s-ok"></i>Space</span><span><i class="cmap-s-warn"></i>Almost full</span><span><i class="cmap-s-full"></i>Full</span>', root);
    legend.setAttribute('aria-hidden', 'true');

    // ---------- Viewport ----------
    function size() {
      const r = root.getBoundingClientRect();
      return { cw: Math.max(1, r.width), ch: Math.max(1, r.height) };
    }
    const clampW = w => clampN(w, 200, 1500);
    function clampView() {
      const ar = size().ch / size().cw;
      const cx = vb.x + vb.w / 2, cy = vb.y + vb.w * ar / 2;
      vb.x += clampN(cx, 0, W) - cx;
      vb.y += clampN(cy, 0, H) - cy;
    }
    function apply() {
      const { cw, ch } = size();
      vb.h = vb.w * ch / cw;
      svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
      const upp = vb.w / cw;
      data.forEach(c => pinEls[c.id].g.setAttribute('transform', `translate(${c.x} ${c.y}) scale(${upp})`));
      you.setAttribute('transform', `translate(${YOU.x} ${YOU.y}) scale(${upp})`);
      gLabels.setAttribute('font-size', (isCompact() ? 10 : 11.5) * upp);
      gLabels.setAttribute('stroke-width', 3 * upp);
      route.setAttribute('stroke-width', 5 * upp);
      routeCase.setAttribute('stroke-width', 9 * upp);
    }
    function setView(v) {
      const ar = size().ch / size().cw;
      vb.w = v.w; vb.x = v.cx - v.w / 2; vb.y = v.cy - v.w * ar / 2;
      apply();
    }
    function viewFor(x0, y0, x1, y1, pad) {
      const { cw, ch } = size();
      // Fit into the part of the map not covered by the side panel / bottom sheet.
      const aw = isCompact() ? cw : Math.max(200, cw - panel.offsetWidth - 20);
      const ah = isCompact() ? ch * 0.66 : ch;
      const w = clampW(Math.max((x1 - x0) * (1 + pad) * cw / aw, (y1 - y0) * (1 + pad) * cw / ah));
      return offsetView({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w });
    }
    // Shift the view so the target isn't hidden behind the panel (desktop) or the bottom sheet (compact).
    function offsetView(v) {
      const { cw, ch } = size();
      const upp = v.w / cw;
      if (isCompact()) v.cy += ch * 0.17 * upp;
      else v.cx -= (panel.offsetWidth + 20) / 2 * upp;
      return v;
    }
    function cancelAnim() { cancelAnimationFrame(anim); }
    function animateView(v, ms) {
      cancelAnim();
      ms = ms || 650;
      const ar = size().ch / size().cw;
      const from = { cx: vb.x + vb.w / 2, cy: vb.y + vb.w * ar / 2, w: vb.w };
      const t0 = performance.now();
      const step = now => {
        const t = Math.min(1, (now - t0) / ms);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setView({ cx: from.cx + (v.cx - from.cx) * e, cy: from.cy + (v.cy - from.cy) * e, w: from.w + (v.w - from.w) * e });
        if (t < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }
    function zoomAt(mx, my, f) {
      const nw = clampW(vb.w * f), k = nw / vb.w;
      vb.x = mx - (mx - vb.x) * k;
      vb.y = my - (my - vb.y) * k;
      vb.w = nw;
      clampView(); apply();
    }
    function fitAll() { setView(viewFor(60, 70, 970, 650, 0.02)); }

    new ResizeObserver(() => {
      const { cw } = size();
      if (cw < 2) return;
      root.classList.toggle('cmap--compact', !!opts.compact || cw < 640);
      if (!fitted) { fitted = true; fitAll(); } else { clampView(); apply(); }
    }).observe(root);

    // Pan (drag) — pointer capture only starts once the pointer really moves, so pin clicks still work.
    let drag = null;
    svg.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, id: e.pointerId, moved: false };
    });
    svg.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 4) return;
        drag.moved = true; dragged = true;
        svg.setPointerCapture(e.pointerId);
        root.classList.add('is-dragging');
        cancelAnim();
      }
      const upp = vb.w / size().cw;
      vb.x = drag.vx - dx * upp; vb.y = drag.vy - dy * upp;
      clampView(); apply();
    });
    const endDrag = e => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      root.classList.remove('is-dragging');
      setTimeout(() => { dragged = false; }, 0);
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    let hintTimer = 0;
    svg.addEventListener('wheel', e => {
      if (!e.ctrlKey && !e.metaKey) {
        hint.classList.add('is-show');
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => hint.classList.remove('is-show'), 1100);
        return;
      }
      e.preventDefault();
      cancelAnim();
      const r = svg.getBoundingClientRect(), upp = vb.w / r.width;
      zoomAt(vb.x + (e.clientX - r.left) * upp, vb.y + (e.clientY - r.top) * upp, Math.exp(e.deltaY * 0.0018));
    }, { passive: false });

    ctrls.addEventListener('click', e => {
      const b = e.target.closest('[data-z]');
      if (!b) return;
      const ar = size().ch / size().cw;
      const cx = vb.x + vb.w / 2, cy = vb.y + vb.w * ar / 2;
      if (b.dataset.z === 'me') animateView(offsetView({ cx: YOU.x, cy: YOU.y, w: 420 }));
      else animateView({ cx, cy, w: clampW(vb.w * (b.dataset.z === 'in' ? 0.7 : 1.4)) }, 300);
    });

    // ---------- Rendering ----------
    function renderPins() {
      data.forEach(c => {
        const { g, t } = pinEls[c.id];
        g.setAttribute('data-s', status(c).key);
        g.classList.toggle('is-sel', c.id === selectedId);
        g.classList.toggle('is-dim', floor !== 'All' && c.level !== floor);
        t.textContent = freeOf(c);
        g.setAttribute('aria-label', `${c.name}: ${freeOf(c)} return slots free, ${c.stock} containers to borrow`);
      });
    }
    function renderList() {
      const q = input.value.trim().toLowerCase();
      const items = data.filter(c => (floor === 'All' || c.level === floor) && (!q || c.name.toLowerCase().includes(q)));
      list.innerHTML = items.length ? items.map(c => {
        const s = status(c);
        return `<button type="button" class="cmap-item${c.id === selectedId ? ' is-active' : ''}" data-id="${c.id}">
          <span class="cmap-item-dot cmap-s-${s.key}"></span>
          <span class="cmap-item-main"><b>${c.name}</b><small>${c.level} · ${s.label}</small></span>
          <span class="cmap-item-num"><b>${freeOf(c)}</b><small>slots free</small></span></button>`;
      }).join('') : '<p class="cmap-empty">No canteens match.</p>';
    }
    function nearestFree(excludeId) {
      let best = null;
      data.forEach(c => {
        if (c.id === excludeId || freeOf(c) <= 0) return;
        const r = routeTo(c);
        if (!best || r.len < best.r.len) best = { c, r };
      });
      return best;
    }
    function renderCard() {
      const c = byId[selectedId];
      root.classList.toggle('has-card', !!c);
      if (!c) { card.hidden = true; return; }
      const s = status(c), free = freeOf(c), r = routeTo(c);
      const pct = Math.round(c.stock / c.cap * 100);
      let alt = '';
      if (s.key === 'full') {
        const n = nearestFree(c.id);
        if (n) alt = `<div class="cmap-alt">This machine is full. Nearest with space: <button type="button" data-act="goto" data-id="${n.c.id}">${n.c.name} · ${n.r.mins} min</button></div>`;
      }
      const extra = opts.extraActions.map((a, i) => {
        const dis = a.disabled && a.disabled(c) ? ' disabled' : '';
        const label = typeof a.label === 'function' ? a.label(c) : a.label;
        return `<button type="button" class="cmap-btn${a.primary ? ' cmap-btn--primary' : ''}" data-extra="${i}"${dis}>${label}</button>`;
      }).join('');
      card.innerHTML = `
        <button type="button" class="cmap-card-x" data-act="close" aria-label="Close">×</button>
        <div class="cmap-card-kicker">Level ${c.level} · ${c.spot}</div>
        <h4 class="cmap-card-title">${c.name}</h4>
        <span class="cmap-chip cmap-chip--${s.key}">${s.label}</span>
        <div class="cmap-stats">
          <div><b>${c.stock}</b><span>containers to borrow</span></div>
          <div><b>${free}</b><span>return slots free</span></div>
        </div>
        <div class="cmap-bar" title="${pct}% full"><i class="cmap-s-${s.key}" style="width:${pct}%"></i></div>
        <div class="cmap-walk">${ICON.walk}<span>${r.mins} min walk · ${r.metres} m from ${YOU.label}</span></div>
        ${alt}
        <div class="cmap-actions">
          ${extra}
          <button type="button" class="cmap-btn${extra ? '' : ' cmap-btn--primary'}" data-act="dir"${routeFor === c.id ? ' disabled' : ''}>${routeFor === c.id ? 'Route shown' : 'Directions'}</button>
        </div>`;
      card.hidden = false;
    }
    function renderAll() { renderPins(); renderList(); renderCard(); }

    function drawRoute(c) {
      const r = routeTo(c);
      const pts = r.pts.map(p => p.join(',')).join(' ');
      route.setAttribute('points', pts);
      routeCase.setAttribute('points', pts);
      route.style.strokeDasharray = r.len;
      route.animate([{ strokeDashoffset: r.len }, { strokeDashoffset: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' });
      const xs = r.pts.map(p => p[0]), ys = r.pts.map(p => p[1]);
      animateView(viewFor(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 0.45));
    }
    function clearRoute() { route.setAttribute('points', ''); routeCase.setAttribute('points', ''); }

    function select(id, o) {
      o = o || {};
      selectedId = id;
      routeFor = o.route ? id : null;
      renderAll();
      const c = byId[id];
      if (!c) { clearRoute(); return; }
      if (routeFor) drawRoute(c);
      else { clearRoute(); animateView(offsetView({ cx: c.x, cy: c.y, w: 380 })); }
      if (opts.onSelect) opts.onSelect(c);
    }
    function deselect() { selectedId = null; routeFor = null; clearRoute(); renderAll(); }
    function nearest() { const n = nearestFree(); if (n) select(n.c.id, { route: true }); }

    function emit() { listeners.forEach(fn => fn(data)); }
    function adjust(id, delta) {
      const c = byId[id];
      if (!c) return 0;
      const before = c.stock;
      c.stock = clampN(c.stock + delta, 0, c.cap);
      const applied = c.stock - before;
      if (applied) {
        const g = pinEls[id].g;
        g.classList.remove('is-pulse');
        void g.getBBox();
        g.classList.add('is-pulse');
        renderAll(); emit();
      }
      return applied;
    }

    // ---------- Events ----------
    input.addEventListener('input', () => { renderList(); panel.classList.add('is-open'); });
    panel.addEventListener('focusin', () => panel.classList.add('is-open'));
    document.addEventListener('pointerdown', e => { if (!panel.contains(e.target)) panel.classList.remove('is-open'); });
    list.addEventListener('click', e => {
      const b = e.target.closest('[data-id]');
      if (!b) return;
      select(b.dataset.id);
      panel.classList.remove('is-open');
      if (isCompact()) input.blur();
    });
    nearestBtn.addEventListener('click', nearest);
    fab.addEventListener('click', nearest);
    floors.addEventListener('click', e => {
      const b = e.target.closest('[data-floor]');
      if (!b) return;
      floor = b.dataset.floor;
      floors.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (selectedId && floor !== 'All' && byId[selectedId].level !== floor) deselect();
      else renderAll();
    });
    card.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.disabled) return;
      if (b.dataset.act === 'close') deselect();
      else if (b.dataset.act === 'dir') select(selectedId, { route: true });
      else if (b.dataset.act === 'goto') select(b.dataset.id, { route: true });
      else if (b.dataset.extra != null) opts.extraActions[+b.dataset.extra].run(byId[selectedId], api);
    });

    // Simulated live capacity changes; paused while the map is off-screen.
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(root);
    if (opts.live) setInterval(() => {
      if (!visible || document.hidden) return;
      const pool = data.filter(c => c.sim !== false);
      const c = pool[Math.floor(Math.random() * pool.length)];
      adjust(c.id, [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]);
    }, 2600);

    renderAll();

    const api = {
      select, deselect, nearest, adjust, fitAll,
      directions: id => select(id, { route: true }),
      get: id => byId[id],
      all: () => data,
      selected: () => byId[selectedId] || null,
      on: fn => listeners.push(fn),
      refresh: renderAll,
      freeOf, status
    };
    return api;
  }

  window.CampusMap = { create, CANTEENS };
})();
