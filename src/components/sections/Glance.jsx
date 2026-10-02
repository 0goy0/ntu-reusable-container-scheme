import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHead } from '../ui';
import { Icon } from '../icons';
import { ASK, GLANCE } from '../../data/content';

export default function Glance() {
  return (
    <section className="glance" id="glance">
      <div className="wrap">
        <SectionHead index="01" kicker="At a glance" title="The proposal in thirty seconds." />
        <div className="glance-grid">
          {GLANCE.map((g, i) => (
            <Reveal key={g.label} className="gcard" delay={i * 0.06}>
              <span className="gicon"><Icon name={g.icon} size={22} /></span>
              <h3>{g.label}</h3>
              <p>{g.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="ask" delay={0.1}>
          <p><b>The ask:</b> {ASK}</p>
          <a className="btn btn-light" href="#pilot">See the pilot plan <ArrowRight size={18} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
