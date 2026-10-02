import { useCallback, useEffect, useRef, useState } from 'react';
import { CANTEENS } from '../data/campus';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Canteen machine state (containers in stock per machine).
 * `adjust` returns the change actually applied, so callers can tell when a machine is empty/full.
 * While `running`, random borrows/returns are simulated to make the map feel live.
 */
export function useCanteens(running) {
  const [data, setData] = useState(() => CANTEENS.map(c => ({ ...c })));
  const ref = useRef(data);

  const adjust = useCallback((id, delta) => {
    const c = ref.current.find(x => x.id === id);
    if (!c) return 0;
    const stock = clamp(c.stock + delta, 0, c.cap);
    const applied = stock - c.stock;
    if (!applied) return 0;
    ref.current = ref.current.map(x => (x.id === id ? { ...x, stock } : x));
    setData(ref.current);
    return applied;
  }, []);

  const get = useCallback(id => ref.current.find(x => x.id === id), []);
  const all = useCallback(() => ref.current, []);

  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => {
      if (document.hidden) return;
      const pool = ref.current.filter(c => c.sim !== false);
      const c = pool[Math.floor(Math.random() * pool.length)];
      adjust(c.id, [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]);
    }, 2600);
    return () => clearInterval(t);
  }, [running, adjust]);

  return { data, adjust, get, all };
}
