import { useEffect, useRef, useState } from 'react';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** 0 → 1 progress through a tall section whose content is `position: sticky`. */
export function sectionProgress(el) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const total = r.height - innerHeight;
  return total <= 0 ? 0 : clamp(-r.top / total);
}

// One shared, rAF-throttled scroll/resize listener for every subscriber.
const subs = new Set();
let ticking = false;
const run = () => { ticking = false; subs.forEach(f => f()); };
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };

/** Run `fn` on every scroll/resize frame (and once on mount). Write to refs/DOM or set state sparingly. */
export function useScrollEffect(fn) {
  const f = useRef(fn);
  useEffect(() => { f.current = fn; });
  useEffect(() => {
    const h = () => f.current();
    subs.add(h);
    if (subs.size === 1) {
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
    }
    h();
    return () => {
      subs.delete(h);
      if (!subs.size) {
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
      }
    };
  }, []);
}

/** True once (or while, if `once` is false) the element is in view. */
const STEPS = Array.from({ length: 21 }, (_, i) => i / 20);

export function useInView({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      // In view once 20% is visible, or once it fills most of the screen (for elements taller than the viewport).
      const seen = e.isIntersecting && (e.intersectionRatio >= threshold || e.intersectionRect.height > innerHeight * 0.5);
      if (seen) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) setInView(false);
    }, { threshold: STEPS, rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}
