import { NODES, EDGES, YOU, M_PER_UNIT, WALK_M_PER_MIN } from '../data/campus';

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const ADJ = {};
EDGES.forEach(([a, b]) => {
  (ADJ[a] ||= []).push(b);
  (ADJ[b] ||= []).push(a);
});

// Dijkstra over the small road graph.
function shortestPath(from, to) {
  const d = {}, prev = {}, done = new Set();
  Object.keys(NODES).forEach(k => { d[k] = Infinity; });
  d[from] = 0;
  for (;;) {
    let u = null;
    for (const k in d) if (!done.has(k) && (u === null || d[k] < d[u])) u = k;
    if (u === null || d[u] === Infinity || u === to) break;
    done.add(u);
    for (const v of ADJ[u]) {
      const nd = d[u] + dist(NODES[u], NODES[v]);
      if (nd < d[v]) { d[v] = nd; prev[v] = u; }
    }
  }
  const path = [to];
  let c = to;
  while (c !== from) {
    c = prev[c];
    if (c === undefined) return [from, to];
    path.unshift(c);
  }
  return path;
}

/** Walking route from "you" to a canteen: points, length (map units), metres and minutes. */
export function routeTo(c) {
  const pts = [[YOU.x, YOU.y], ...shortestPath(YOU.node, c.node).map(n => NODES[n]), [c.x, c.y]];
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += dist(pts[i - 1], pts[i]);
  const m = len * M_PER_UNIT;
  return { pts, len, metres: Math.round(m / 10) * 10, mins: Math.max(1, Math.round(m / WALK_M_PER_MIN)) };
}

export const freeOf = c => c.cap - c.stock;

export function status(c) {
  const free = freeOf(c);
  if (free <= 0) return { key: 'full', label: 'Full, return elsewhere' };
  if (free / c.cap < 0.2) return { key: 'warn', label: 'Almost full' };
  return { key: 'ok', label: 'Space to return' };
}

/** Closest canteen (by walking distance) whose machine still has free return slots. */
export function nearestFree(data, excludeId) {
  let best = null;
  for (const c of data) {
    if (c.id === excludeId || freeOf(c) <= 0) continue;
    const r = routeTo(c);
    if (!best || r.len < best.r.len) best = { c, r };
  }
  return best;
}
