// Branded fallback for listings without photos — gradient + house mark so the
// empty state reads as intentional rather than broken.
export default function ImagePlaceholder({ label = true }: { label?: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-50 via-slate-50 to-brand-100">
      <svg className="w-14 h-14 text-brand-200" viewBox="0 0 64 64" fill="none">
        <path d="M32 14 L50 29 V50 H38 V38 H26 V50 H14 V29 Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="50" cy="16" r="5" className="fill-accent-100" />
      </svg>
      {label && <span className="text-[11px] font-medium tracking-wide uppercase text-brand-200">Photos coming soon</span>}
    </div>
  )
}
