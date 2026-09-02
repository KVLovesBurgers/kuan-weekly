export function Logo({ className = "logo", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden className={className}>
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 32h48M32 8v48" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
      <path d="M32 32 L50.5 32 A18.5 18.5 0 0 0 32 13.5" stroke="#8a9bb0" strokeWidth="1.4" />
      <circle cx="50.5" cy="32" r="2" fill="currentColor" />
      <circle cx="32" cy="32" r="1.6" fill="currentColor" />
    </svg>
  );
}
