import {
  AlertTriangle, ArrowRight, ArrowUpRight, Coins, Droplets, Leaf, Repeat, ShieldCheck,
  Trash2, TrendingDown, Truck, Undo2, Wallet
} from 'lucide-react';

// Icon names used in data/content.js → lucide-react components.
const ICONS = {
  alert: AlertTriangle, arrowRight: ArrowRight, arrowUpRight: ArrowUpRight, coins: Coins, droplets: Droplets,
  leaf: Leaf, repeat: Repeat, shield: ShieldCheck, trash: Trash2, trendingDown: TrendingDown,
  truck: Truck, undo: Undo2, wallet: Wallet
};

export function Icon({ name, size = 20, ...rest }) {
  const C = ICONS[name];
  return C ? <C size={size} strokeWidth={1.75} aria-hidden="true" {...rest} /> : null;
}

/** Container logo mark used in the nav and footer. */
export function BrandMark({ size = 16 }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h16l-1.4 9.2A2 2 0 0 1 16.6 20H7.4a2 2 0 0 1-2-1.8Z" /><path d="M3 6.5h18" /><path d="M10 4h4" />
      </svg>
    </span>
  );
}
