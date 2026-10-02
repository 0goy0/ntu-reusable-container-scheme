import { useRef, useState } from 'react';
import { ArrowRight, ArrowUp, ShieldCheck } from 'lucide-react';
import { Reveal, SectionHead } from '../ui';
import { BrandMark, Icon } from '../icons';
import { clamp, useScrollEffect } from '../../hooks/scroll';
import { ASK, GROUP_MEMBERS, KPIS, OUTCOMES, PILOT_STEPS, REFERENCES, RISKS, TITLE } from '../../data/content';

export function Risks() {
  return (
    <section className="risks" id="risks">
      <div className="wrap">
        <SectionHead
          index="06"
          kicker="Risks & mitigations"
          title="The risks, and how we manage them."
          lead="Every limitation identified in our proposal, paired with the measure that keeps it in check."
        />
        <div className="risk-grid">
          {RISKS.map((r, i) => (
            <Reveal key={r.title} className="risk" delay={(i % 3) * 0.06}>
              <div className="risk-top"><span className="risk-icon"><Icon name={r.icon} /></span><h3>{r.title}</h3></div>
              <p>{r.text}</p>
              <div className="mitigation">
                <div><b><ShieldCheck size={14} aria-hidden="true" />Mitigation</b>{r.mitigation}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pilot() {
  const timeline = useRef(null), fill = useRef(null);
  const [reached, setReached] = useState(-1);

  // Timeline fills as it scrolls up the screen.
  useScrollEffect(() => {
    const r = timeline.current.getBoundingClientRect();
    const p = clamp((innerHeight * 0.75 - r.top) / (innerHeight * 0.5));
    fill.current.style.width = `${p * 100}%`;
    setReached(p <= 0 ? -1 : Math.floor(p * (PILOT_STEPS.length - 1) + 0.001));
  });

  return (
    <section className="pilot" id="pilot">
      <div className="wrap">
        <SectionHead index="07" kicker="The ask" title="Start with a pilot. Let the data decide." lead={ASK} />
        <div className="timeline" ref={timeline}>
          <div className="track"><i ref={fill} /></div>
          {PILOT_STEPS.map((s, i) => (
            <div key={s.title} className={`tl${i <= reached ? ' on' : ''}`} data-n={i + 1}><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
        <p className="kpi-head">What we will measure</p>
        <div className="kpis">
          {KPIS.map(([icon, label], i) => (
            <Reveal key={label} className="kpi" delay={i * 0.04}><i><Icon name={icon} size={18} /></i>{label}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Outcomes() {
  const list = useRef(null);
  const [lit, setLit] = useState([]);

  // Light up whichever lines are near the middle of the screen.
  useScrollEffect(() => {
    const next = [...list.current.children].map(li => {
      const r = li.getBoundingClientRect();
      return Math.abs(r.top + r.height / 2 - innerHeight / 2) < innerHeight * 0.22;
    });
    setLit(prev => (prev.join() === next.join() ? prev : next));
  });

  return (
    <section className="outcomes" id="outcomes">
      <div className="wrap">
        <p className="kicker"><span className="kicker-n">08</span>Expected outcomes</p>
        <ul className="big-list" ref={list}>
          {OUTCOMES.map((o, i) => <li key={o} className={lit[i] ? 'lit' : undefined}>{o}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap">
        <Reveal as="h2" id="cta-title">Takeaway, without the throwaway.</Reveal>
        <Reveal as="p" delay={0.08}>{ASK}</Reveal>
        <Reveal className="cta" delay={0.14}>
          <a className="btn btn-light" href="#demo">Try the demo again <ArrowRight size={18} aria-hidden="true" /></a>
          <a className="btn btn-ghost-light" href="#top">Back to top <ArrowUp size={18} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <p className="foot-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><BrandMark />{TITLE}</p>
          <p>CC0006 group proposal, Nanyang Technological University.</p>
          {GROUP_MEMBERS.length > 0 && <p><b>Team:</b> {GROUP_MEMBERS.join(', ')}</p>}
          <p>Map layout, machine locations and capacities are illustrative.</p>
        </div>
        <div className="refs">
          <h2>References</h2>
          <ol>
            {REFERENCES.map(r => <li key={r.doi}>{r.text} <a href={r.doi} target="_blank" rel="noreferrer">{r.doi}</a></li>)}
          </ol>
        </div>
      </div>
    </footer>
  );
}
