import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Canonical themed input look — brand border + focus ring, used across all forms. */
export const inputClasses =
  'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none bg-white ' +
  'text-slate-700 placeholder-slate-400 transition-colors ' +
  'focus:border-brand-400 focus:ring-2 focus:ring-brand-50'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon — wraps the input in a bordered row with the icon inline. */
  icon?: React.ReactNode
  wrapperClassName?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { icon, className, wrapperClassName, ...props }, ref,
) {
  if (icon) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 bg-white border border-slate-200 rounded-xl transition-colors',
        'focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-50',
        wrapperClassName,
      )}>
        <span className="shrink-0 text-slate-400">{icon}</span>
        <input
          ref={ref}
          className={cn('w-full py-2.5 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400', className)}
          {...props}
        />
      </div>
    )
  }
  return <input ref={ref} className={cn(inputClasses, className)} {...props} />
})

export default TextField
