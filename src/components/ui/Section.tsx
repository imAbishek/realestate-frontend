import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Section wrapper matching the mobile look: title + subtitle + accent bar header,
 * optional right-aligned action, and an optional full-width surface band behind
 * the constrained content (used for the alternating white / brand-tint rhythm).
 */
export default function Section({
  title,
  subtitle,
  action,
  surface = 'none',
  className,
  children,
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  surface?: 'none' | 'white' | 'tint'
  className?: string
  children: ReactNode
}) {
  const inner = (
    <div className={cn('max-w-7xl mx-auto px-4 py-12', className)}>
      {(title || action) && (
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            <div className="w-8 h-[3px] rounded bg-accent-400 mt-3" />
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )

  if (surface === 'none') return inner
  return <div className={surface === 'tint' ? 'bg-brand-50/40' : 'bg-white'}>{inner}</div>
}
