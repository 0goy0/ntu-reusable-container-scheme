import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { clamp, useScrollEffect } from '../../hooks/scroll';
import { BREAK_EVEN, DEPOSIT, HERO, SET_COST } from '../../data/content';

const STATS = [
  [`$${SET_COST.toFixed(2)}`, 'per reusable set, washable for many uses'],
  [`≈${Math.round(BREAK_EVEN)} uses`, 'to beat single-use packaging on cost'],
  ['59%', 'lower climate impact after 20 uses*']
];

export default function Hero() {
  const lid = useRef(null), utensils = useRef(null);

  // The lid lifts and the utensils slide in as the first screen scrolls away.
  useScrollEffect(() => {
    const p = clamp(scrollY / (innerHeight * 0.7));
    lid.current.style.transform = `translate(${p * 14}px, ${-p * 56}px) rotate(${p * 14}deg)`;
    utensils.current.style.opacity = clamp(0.35 + p * 1.5);
    utensils.current.style.transform = `translateX(${-(1 - p) * 16}px)`;
  });

  return (
    <header className="hero" id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="kicker">{HERO.kicker}</p>
            <h1>{HERO.headline[0]} <em>{HERO.headline[1]}</em></h1>
            <p className="lead">{HERO.lead}</p>
            <div className="cta">
              <a className="btn btn-primary" href="#demo">Try the live demo <ArrowRight size={18} aria-hidden="true" /></a>
              <a className="btn" href="#glance">Read the proposal</a>
            </div>
          </div>
          <div className="hero-art">
            <svg viewBox="0 0 420 360" role="img" aria-label={`A reusable takeaway container with stainless-steel utensils, borrowed for a $${DEPOSIT} deposit`}>
              <ellipse cx="200" cy="326" rx="150" ry="12" fill="#13241c" opacity=".07" />
              {/* container body */}
              <path d="M72 180h256l-19 124a18 18 0 0 1-18 15H109a18 18 0 0 1-18-15Z" fill="#1f7a55" />
              <path d="M84 196h232" stroke="#0f4d36" strokeWidth="2" opacity=".5" />
              <rect x="64" y="170" width="272" height="20" rx="8" fill="#0f4d36" />
              {/* reuse mark */}
              <g fill="none" stroke="#d9efe1" strokeWidth="6" strokeLinecap="round">
                <path d="M178 250a24 24 0 0 1 40-15" /><path d="M222 262a24 24 0 0 1-40 15" />
              </g>
              <path d="M220 222l5 16-16-2z" fill="#d9efe1" /><path d="M180 290l-5-16 16 2z" fill="#d9efe1" />
              {/* lid */}
              <g ref={lid} className="hero-lid">
                <rect x="58" y="140" width="284" height="30" rx="12" fill="#d9efe1" stroke="#0f4d36" strokeWidth="2.5" />
                <rect x="170" y="124" width="60" height="20" rx="8" fill="#0f4d36" />
              </g>
              {/* stainless-steel utensils */}
              <g ref={utensils} style={{ opacity: 0.35 }}>
                <rect x="358" y="152" width="9" height="148" rx="4.5" fill="#9aa6a1" />
                <path d="M352 150v-38M362.5 150v-38M373 150v-38" stroke="#9aa6a1" strokeWidth="5" strokeLinecap="round" />
                <path d="M352 147h21" stroke="#9aa6a1" strokeWidth="9" strokeLinecap="round" />
                <ellipse cx="396" cy="140" rx="14" ry="24" fill="#b9c3bf" />
                <rect x="391.5" y="158" width="9" height="142" rx="4.5" fill="#b9c3bf" />
              </g>
            </svg>
          </div>
        </div>
        <div className="hero-stats">
          {STATS.map(([v, l]) => <div className="hero-stat" key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
        <p className="hero-note">* Compared with single-use packaging. Aggarwal (2024); see references.</p>
      </div>
    </header>
  );
}
