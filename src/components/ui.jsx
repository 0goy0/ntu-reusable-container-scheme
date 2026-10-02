import { useEffect, useState } from 'react';
import { useInView } from '../hooks/scroll';

/** Fades/slides children in the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`} style={{ ...style, '--d': `${delay}s` }} {...rest}>
      {children}
    </Tag>
  );
}

/** Counts up from 0 to `to` once visible. */
export function CountUp({ to, dec = 0, prefix = '', suffix = '', as: Tag = 'b', duration = 1300, ...rest }) {
  const [ref, inView] = useInView();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    const t0 = performance.now();
    const f = now => {
      const t = Math.min(1, (now - t0) / duration);
      setV(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <Tag ref={ref} {...rest}>{prefix}{v.toFixed(dec)}{suffix}</Tag>;
}

/** Numbered section header: "02 — THE PROBLEM", headline, optional lead. */
export function SectionHead({ index, kicker, title, lead, className = '' }) {
  return (
    <div className={`shead ${className}`}>
      <Reveal as="p" className="kicker"><span className="kicker-n">{index}</span>{kicker}</Reveal>
      <Reveal as="h2">{title}</Reveal>
      {lead && <Reveal as="p" className="lead" delay={0.08}>{lead}</Reveal>}
    </div>
  );
}
