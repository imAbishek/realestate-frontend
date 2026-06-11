import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

/** White surface with the soft mobile-style elevation + hairline border. */
export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-white rounded-2xl border border-slate-100 shadow-soft', className)}
      {...props}
    />
  )
}
