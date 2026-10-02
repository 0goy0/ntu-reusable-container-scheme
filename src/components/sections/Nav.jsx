import { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollEffect } from '../../hooks/scroll';
import { SHORT_TITLE } from '../../data/content';
import { BrandMark } from '../icons';

const LINKS = [
  ['#glance', 'Overview'], ['#problem', 'Problem'], ['#how', 'How it works'],
  ['#numbers', 'Economics'], ['#risks', 'Risks'], ['#pilot', 'Pilot']
];

export default function Nav() {
  const bar = useRef(null);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  useScrollEffect(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    setSolid(scrollY > 30);
    let a = -1;
    LINKS.forEach(([href], i) => {
      const el = document.querySelector(href);
      if (el && el.getBoundingClientRect().top < innerHeight * 0.4) a = i;
    });
    setActive(a);
  });

  return (
    <>
      <div className="progress" ref={bar} />
      <nav className={`topnav${solid ? ' solid' : ''}${open ? ' open' : ''}`} aria-label="Sections">
        <div className="wrap">
          <a className="brand" href="#top" onClick={() => setOpen(false)}><BrandMark /><span><small>NTU</small>{SHORT_TITLE}</span></a>
          <div className="navlinks" id="nav-menu">
            {LINKS.map(([href, label], i) => <a key={href} href={href} className={i === active ? 'on' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
            <a href="#demo" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>Try the demo</a>
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </>
  );
}
