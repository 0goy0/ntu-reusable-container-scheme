import { useMemo, useRef, useState } from 'react';
import { sectionProgress, useScrollEffect } from '../../hooks/scroll';
import { PROBLEM_POINTS } from '../../data/content';

const ROWS = [6, 5, 4, 3];

// Deterministic pile layout (seeded random jitter) so it looks the same every load.
function usePile() {
  return useMemo(() => {
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const boxes = [];
    ROWS.forEach((n, row) => {
      for (let i = 0; i < n; i++) {
        boxes.push({
          left: `calc(50% + ${(i - (n - 1) / 2) * 78 - 42 + (rnd() - 0.5) * 16}px)`,
          bottom: row * 44,
          r: `${((rnd() - 0.5) * 16).toFixed(1)}deg`
        });
      }
    });
    return boxes;
  }, []);
}

export default function Problem() {
  const section = useRef(null);
  const boxes = usePile();
  const [shown, setShown] = useState(0);
  const [point, setPoint] = useState(0);
  const [fade, setFade] = useState(false);

  useScrollEffect(() => {
    const p = sectionProgress(section.current);
    setShown(boxes.filter((_, i) => p > 0.03 + i * (0.62 / boxes.length)).length);
    setFade(p > 0.8);
    setPoint(p < 0.3 ? 0 : p < 0.58 ? 1 : 2);
  });

  return (
    <section className="problem" id="problem" ref={section}>
      <div className="sticky">
        <div className="wrap problem-grid">
          <div>
            <p className="kicker"><span className="kicker-n">02</span>The problem</p>
            <h2>Every forgotten container becomes another disposable.</h2>
            <ol className="points">
              {PROBLEM_POINTS.map((pt, i) => (
                <li key={pt.title} className={i === point ? 'on' : undefined}><b>{pt.title}</b><span>{pt.text}</span></li>
              ))}
            </ol>
          </div>
          <div className={`pile${fade ? ' fade' : ''}`} aria-hidden="true">
            <div className="floor" />
            {boxes.map((b, i) => (
              <div key={i} className={`dispo${i < shown ? ' on' : ''}`} style={{ left: b.left, bottom: b.bottom, '--r': b.r }}>
                <svg viewBox="0 0 84 50">
                  <path d="M5 22h74l-6 24H11z" fill="#fff" stroke="#c9c2b3" strokeWidth="2" />
                  <path d="M3 22c4-12 12-17 39-17s35 5 39 17z" fill="#fbfaf6" stroke="#c9c2b3" strokeWidth="2" />
                </svg>
              </div>
            ))}
            <div className="reuse">
              <svg viewBox="0 0 300 230" aria-hidden="true">
                <path d="M34 84h232l-17 112a16 16 0 0 1-16 13H67a16 16 0 0 1-16-13Z" fill="#1f7a55" />
                <rect x="26" y="70" width="248" height="18" rx="7" fill="#0f4d36" />
                <rect x="22" y="42" width="256" height="28" rx="11" fill="#d9efe1" stroke="#0f4d36" strokeWidth="2.5" />
                <rect x="122" y="28" width="56" height="18" rx="7" fill="#0f4d36" />
                <g fill="none" stroke="#d9efe1" strokeWidth="6" strokeLinecap="round"><path d="M128 146a22 22 0 0 1 37-14" /><path d="M172 158a22 22 0 0 1-37 14" /></g>
              </svg>
              <p>Forgetting shouldn't mean going disposable.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
