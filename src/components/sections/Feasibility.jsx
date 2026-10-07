import { useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { CountUp, Reveal, SectionHead } from '../ui';
import { useInView } from '../../hooks/scroll';
import { BREAK_EVEN, COSTS, SET_COST } from '../../data/content';

// Validated pair (dataviz palette check: passes CVD, normal-vision and contrast on the card surface).
const REUSE_C = '#1f7a55';
const DISPO_C = '#c2410c';
const MAX_N = 120, MAX_V = 16;
const L = 56, R = 620, TOP = 16, BOT = 272;
const X = n => L + (n / MAX_N) * (R - L);
const Y = v => BOT - (v / MAX_V) * (BOT - TOP);
const reuse = n => SET_COST + COSTS.wash * n;
const dispo = n => COSTS.disposable * n;
const money = v => `$${v.toFixed(2)}`;

function BreakEvenChart() {
  const [ref, inView] = useInView();
  const svg = useRef(null);
  const [n, setN] = useState(20);
  const r = reuse(n), d = dispo(n), cheaper = r < d;
  const beX = X(BREAK_EVEN), beY = Y(reuse(BREAK_EVEN));

  // Hovering anywhere on the plot moves the crosshair, just like the slider.
  const onMove = e => {
    const box = svg.current.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * 640;
    setN(Math.round(Math.min(MAX_N, Math.max(1, ((vx - L) / (R - L)) * MAX_N))));
  };

  return (
    <>
      <div className="legend" aria-hidden="true">
        <span><i style={{ background: REUSE_C }} />Reusable set (incl. $0.05 per wash)</span>
        <span><i style={{ background: DISPO_C }} />Disposable set every meal</span>
      </div>
      <svg
        ref={el => { ref.current = el; svg.current = el; }}
        className={`be-chart${inView ? ' is-in' : ''}`}
        viewBox="0 0 640 312"
        role="img"
        aria-label={`Cumulative cost chart. The reusable set becomes cheaper than disposables after about ${Math.ceil(BREAK_EVEN)} uses.`}
        onPointerMove={onMove}
      >
        {[0, 4, 8, 12, 16].map(v => (
          <g key={v}><line className="grid" x1={L} x2={R} y1={Y(v)} y2={Y(v)} /><text x={L - 10} y={Y(v) + 4} textAnchor="end">${v}</text></g>
        ))}
        {[0, 20, 40, 60, 80, 100, 120].map(t => <text key={t} x={X(t)} y={BOT + 20} textAnchor="middle">{t}</text>)}
        <text className="axis-label" x={R} y={BOT + 40} textAnchor="end">Number of uses</text>
        <text className="axis-label" x={L - 10} y={TOP - 14} textAnchor="end">Cost</text>
        {/* 10% washes: where each option is cheaper */}
        <polygon points={`${X(0)},${Y(reuse(0))} ${beX},${beY} ${X(0)},${Y(0)}`} fill={DISPO_C} opacity=".08" />
        <polygon points={`${beX},${beY} ${X(MAX_N)},${Y(dispo(MAX_N))} ${X(MAX_N)},${Y(reuse(MAX_N))}`} fill={REUSE_C} opacity=".1" />
        <line className="line" pathLength="1" x1={X(0)} y1={Y(0)} x2={X(MAX_N)} y2={Y(dispo(MAX_N))} stroke={DISPO_C} />
        <line className="line" pathLength="1" x1={X(0)} y1={Y(reuse(0))} x2={X(MAX_N)} y2={Y(reuse(MAX_N))} stroke={REUSE_C} />
        {/* break-even marker with surface ring */}
        <circle cx={beX} cy={beY} r="7" fill="#fffdf7" stroke="#13241c" strokeWidth="2.5" />
        <text x={beX - 14} y={beY - 16} textAnchor="end" className="axis-label">Break-even ≈ {Math.ceil(BREAK_EVEN)} uses</text>
        {/* crosshair */}
        <line x1={X(n)} x2={X(n)} y1={TOP} y2={BOT} stroke="#13241c" strokeOpacity=".35" strokeWidth="1" />
        <circle cx={X(n)} cy={Y(d)} r="5" fill={DISPO_C} stroke="#fffdf7" strokeWidth="2" />
        <circle cx={X(n)} cy={Y(r)} r="5" fill={REUSE_C} stroke="#fffdf7" strokeWidth="2" />
        <rect x={L} y={TOP} width={R - L} height={BOT - TOP} fill="transparent" />
      </svg>
      <label className="slider">
        <span>Number of uses: <b>{n}</b></span>
        <input type="range" min="1" max={MAX_N} value={n} onChange={e => setN(+e.target.value)} />
      </label>
      <div className="be-read" aria-live="polite">
        <span><i className="legend-dot" style={{ background: REUSE_C }} />Reusable: <b>{money(r)}</b></span>
        <span><i className="legend-dot" style={{ background: DISPO_C }} />Disposable: <b>{money(d)}</b></span>
        <span className="tag" style={{ background: cheaper ? '#d9efe1' : '#f7e1d7', color: cheaper ? '#0f4d36' : '#7c2d12' }}>
          {cheaper ? 'Reusable saves' : 'Disposable cheaper by'} {money(Math.abs(d - r))}
        </span>
      </div>
      <table className="sr-only">
        <caption>Cumulative cost by number of uses</caption>
        <thead><tr><th>Uses</th><th>Reusable</th><th>Disposable</th></tr></thead>
        <tbody>{[1, 20, 40, 57, 60, 80, 100, 120].map(k => <tr key={k}><td>{k}</td><td>{money(reuse(k))}</td><td>{money(dispo(k))}</td></tr>)}</tbody>
      </table>
    </>
  );
}

function ImpactRing() {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`ring-card reveal${inView ? ' is-in' : ''}`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#e3dccd" strokeWidth="10" />
        <circle className="ring" cx="60" cy="60" r="50" fill="none" stroke="#1f7a55" strokeWidth="10" strokeLinecap="round" pathLength="100" transform="rotate(-90 60 60)" />
        <CountUp as="text" to={59} suffix="%" x="60" y="69" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="28" fontWeight="600" fill="#13241c" />
      </svg>
      <p><b>59% lower climate-change impact</b> after 20 uses, compared with single-use packaging (Aggarwal, 2024).</p>
    </div>
  );
}

export default function Feasibility() {
  return (
    <section className="feas" id="numbers">
      <div className="wrap">
        <SectionHead
          index="05"
          kicker="The economics"
          title={`Pays for itself in about ${Math.ceil(BREAK_EVEN)} uses.`}
          lead={`One reusable set costs ${money(SET_COST)} upfront and ${money(COSTS.wash)} per wash. A disposable set costs ${money(COSTS.disposable)} every single time.`}
        />
        <div className="costs">
          <Reveal className="cost"><span>Container</span><CountUp to={COSTS.container} dec={2} prefix="$" /><small>durable, reusable</small></Reveal>
          <Reveal className="cost" delay={0.06}><span>Utensils</span><CountUp to={COSTS.utensils} dec={2} prefix="$" /><small>stainless steel</small></Reveal>
          <Reveal className="cost" delay={0.12}><span>Washing</span><CountUp to={COSTS.wash} dec={2} prefix="$" /><small>per wash</small></Reveal>
          <Reveal className="cost total" delay={0.18}><span>Reusable set</span><CountUp to={SET_COST} dec={2} prefix="$" /><small>total upfront, per set</small></Reveal>
        </div>
        <div className="be-grid">
          <Reveal className="chart-card">
            <h3>Break-even calculator</h3>
            <p>Hover over the chart or drag the slider to compare the total cost of each option.</p>
            <BreakEvenChart />
          </Reveal>
          <div className="side-stats">
            <ImpactRing />
            <Reveal className="mini"><CountUp to={COSTS.disposable} dec={2} prefix="$" /><span>per disposable takeaway set</span></Reveal>
            <Reveal className="mini"><CountUp to={Math.ceil(BREAK_EVEN)} prefix="≈" /><span>uses for a reusable set to break even</span></Reveal>
          </div>
        </div>
        <Reveal as="p" className="caveat">
          <AlertTriangle size={18} aria-hidden="true" />
          <span><b>Assumptions:</b> feasibility depends on high return rates, low loss and damage rates, the number of times each container is reused, and actual labour costs. The pilot measures all of these.</span>
        </Reveal>
      </div>
    </section>
  );
}
