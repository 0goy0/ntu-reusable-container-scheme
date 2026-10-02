import { useRef, useState } from 'react';
import { sectionProgress, useScrollEffect } from '../../hooks/scroll';
import { DEPOSIT, STEPS } from '../../data/content';

// Shared palette so all five scenes read as one set.
const C = { ink: '#13241c', green: '#1f7a55', dark: '#0f4d36', mint: '#d9efe1', paper: '#fffdf7', line: '#e3dccd', muted: '#5a6960', steel: '#9aa6a1', blue: '#1f6feb' };
const T = { fontFamily: 'Inter Variable, Inter, system-ui, sans-serif' };

// A small container glyph reused across scenes.
const Box = ({ x, y, w = 80 }) => {
  const h = w * 0.42;
  return (
    <g>
      <path d={`M${x} ${y + h * 0.3}h${w}l-${w * 0.07} ${h * 0.7}H${x + w * 0.07}Z`} fill={C.green} />
      <rect x={x - w * 0.03} y={y} width={w * 1.06} height={h * 0.3} rx={h * 0.12} fill={C.mint} stroke={C.dark} strokeWidth="2" />
    </g>
  );
};

const SCENES = [
  // 1 · Borrow at the machine
  <svg viewBox="0 0 360 280" key="s1">
    <rect x="112" y="26" width="136" height="232" rx="16" fill={C.green} />
    <rect x="130" y="46" width="100" height="56" rx="8" fill={C.mint} />
    <text x="180" y="68" textAnchor="middle" style={T} fontSize="11" fontWeight="700" letterSpacing="1.5" fill={C.dark}>DEPOSIT</text>
    <text x="180" y="92" textAnchor="middle" style={T} fontSize="22" fontWeight="700" fill={C.dark}>${DEPOSIT}.00</text>
    <rect x="130" y="114" width="100" height="96" rx="8" fill={C.dark} />
    {[0, 1, 2, 3].map(i => <rect key={i} x="142" y={124 + i * 20} width="76" height="12" rx="4" fill={C.mint} opacity={1 - i * 0.12} />)}
    <rect x="148" y="224" width="64" height="12" rx="6" fill={C.dark} />
    <rect x="266" y="116" width="58" height="38" rx="7" fill={C.paper} stroke={C.line} strokeWidth="2" />
    <rect x="266" y="126" width="58" height="7" fill={C.line} />
    <g fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round">
      <path d="M254 124a10 10 0 0 1 0 22" /><path d="M260 118a18 18 0 0 1 0 34" />
    </g>
  </svg>,
  // 2 · Stall packs the meal
  <svg viewBox="0 0 360 280" key="s2">
    <rect x="70" y="44" width="220" height="44" rx="10" fill={C.dark} />
    <text x="180" y="72" textAnchor="middle" style={T} fontSize="14" fontWeight="700" letterSpacing="2" fill={C.mint}>STALL 04</text>
    <rect x="86" y="88" width="188" height="90" fill={C.paper} stroke={C.line} strokeWidth="2" />
    <rect x="60" y="176" width="240" height="64" rx="10" fill="#e9e4d8" />
    <Box x={138} y={140} w={84} />
    <g stroke={C.muted} strokeWidth="2.5" strokeLinecap="round" fill="none">
      <path d="M40 158h60" /><path d="M88 148l12 10-12 10" />
    </g>
    <text x="180" y="218" textAnchor="middle" style={T} fontSize="13" fontWeight="600" fill={C.muted}>Packed in a reusable container</text>
  </svg>,
  // 3 · Return to the nearest machine with space
  <svg viewBox="0 0 360 280" key="s3">
    <rect x="36" y="26" width="288" height="228" rx="16" fill="#f3f0ea" />
    <ellipse cx="112" cy="206" rx="58" ry="26" fill="#d5eaca" />
    <path d="M36 140h288M190 26v228" stroke="#fff" strokeWidth="14" />
    <rect x="218" y="56" width="74" height="46" rx="6" fill="#fde6d0" stroke="#eab285" />
    <rect x="62" y="56" width="92" height="46" rx="6" fill="#e5e0d7" />
    <path d="M92 172L190 140 190 102 255 84" fill="none" stroke={C.blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="92" cy="172" r="8" fill={C.blue} stroke="#fff" strokeWidth="3" />
    <path d="M255 84c-3-9-15-14-15-27a15 15 0 1 1 30 0c0 13-12 18-15 27z" fill="#1c9b5c" stroke="#fff" strokeWidth="2" />
    <circle cx="255" cy="57" r="10" fill="#fff" />
    <text x="255" y="61" textAnchor="middle" style={T} fontSize="11" fontWeight="800" fill={C.ink}>18</text>
    <rect x="206" y="186" width="104" height="44" rx="10" fill="#fff" stroke={C.line} />
    <text x="258" y="205" textAnchor="middle" style={T} fontSize="11.5" fontWeight="700" fill="#1c7a4a">18 slots free</text>
    <text x="258" y="220" textAnchor="middle" style={T} fontSize="10.5" fill={C.muted}>3 min walk</text>
  </svg>,
  // 4 · Deposit refunded
  <svg viewBox="0 0 360 280" key="s4">
    <rect x="118" y="22" width="124" height="236" rx="24" fill={C.ink} />
    <rect x="128" y="40" width="104" height="200" rx="14" fill={C.paper} />
    <circle cx="180" cy="104" r="30" fill={C.mint} />
    <path d="M166 104l10 10 20-22" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="180" y="160" textAnchor="middle" style={T} fontSize="11" fontWeight="600" fill={C.muted}>Deposit refunded</text>
    <text x="180" y="188" textAnchor="middle" style={T} fontSize="24" fontWeight="700" fill={C.green}>+${DEPOSIT}.00</text>
    <rect x="150" y="206" width="60" height="6" rx="3" fill={C.line} />
  </svg>,
  // 5 · Washed and redistributed
  <svg viewBox="0 0 360 280" key="s5">
    <rect x="36" y="40" width="160" height="200" rx="14" fill="#d3ddd8" />
    <rect x="36" y="40" width="160" height="34" rx="14" fill="#b9c7c0" />
    <circle cx="60" cy="57" r="5" fill="#1c9b5c" />
    <rect x="118" y="52" width="60" height="10" rx="5" fill="#fff" opacity=".75" />
    <circle cx="116" cy="156" r="58" fill="#cfe5f4" stroke="#fff" strokeWidth="6" />
    <Box x={82} y={128} w={68} /><Box x={82} y={160} w={68} />
    <g stroke={C.green} strokeWidth="2.5" strokeLinecap="round" fill="none">
      <path d="M214 140h34" /><path d="M238 130l10 10-10 10" />
    </g>
    <g style={T} fontSize="12" fontWeight="650" fill={C.dark}>
      {['Canteen 2', 'Canteen 9', 'Canteen 16'].map((n, i) => (
        <g key={n}>
          <rect x="258" y={72 + i * 52} width="84" height="36" rx="9" fill={C.paper} stroke={C.line} strokeWidth="1.5" />
          <text x="300" y={95 + i * 52} textAnchor="middle">{n}</text>
        </g>
      ))}
    </g>
  </svg>
];

export default function HowItWorks() {
  const section = useRef(null), rail = useRef(null);
  const [step, setStep] = useState(0);

  useScrollEffect(() => {
    const p = sectionProgress(section.current);
    setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    rail.current.style.height = `${p * 100}%`;
  });

  return (
    <section className="how" id="how" ref={section}>
      <div className="sticky">
        <div className="wrap how-grid">
          <div>
            <p className="kicker"><span className="kicker-n">03</span>How it works</p>
            <h2>Five steps. One closed loop.</h2>
            <div className="steps-wrap">
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.title} className={i === step ? 'on' : i < step ? 'done' : undefined}>
                    <h3><small>{String(i + 1).padStart(2, '0')}</small>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
              <span className="rail"><i ref={rail} /></span>
            </div>
          </div>
          <div className="stage" aria-hidden="true">
            <span className="stage-num">Step {step + 1} / {STEPS.length}</span>
            {SCENES.map((svg, i) => <div key={i} className={`scene${i === step ? ' on' : ''}`}>{svg}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
