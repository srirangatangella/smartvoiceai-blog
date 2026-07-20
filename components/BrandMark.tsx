/**
 * The Smart Voice AI "Signal" mark — five equalizer bars.
 * Renders as currentColor bars only (no tile); drop it inside the gradient
 * `.nav-logo-mark` box, which supplies the tile + colour.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="currentColor" aria-hidden="true">
      <rect x="93.7" y="196.1" width="44" height="119.8" rx="22" />
      <rect x="163.8" y="151" width="44" height="209.9" rx="22" />
      <rect x="234" y="106" width="44" height="300" rx="22" />
      <rect x="304.1" y="151" width="44" height="209.9" rx="22" />
      <rect x="374.3" y="196.1" width="44" height="119.8" rx="22" />
    </svg>
  );
}
