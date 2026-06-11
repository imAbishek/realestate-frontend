import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export type BadgeTone = 'brand' | 'accent' | 'amber' | 'green' | 'slate' | 'purple'

const tones: Record<BadgeTone, string> = {
  brand:  'bg-brand-50 text-brand-800 border-brand-200',
  accent: 'bg-accent-50 text-accent-600 border-accent-100',
  amber:  'bg-amber-50 text-amber-800 border-amber-200',
  green:  'bg-green-50 text-green-800 border-green-200',
  slate:  'bg-slate-100 text-slate-700 border-slate-200',
  purple: 'bg-purple-50 text-purple-800 border-purple-200',
}

export default function Badge({
  tone = 'slate',
  className,
  children,
}: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
