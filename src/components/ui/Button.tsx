import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors whitespace-nowrap ' +
  'disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200'

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-800',
  secondary: 'bg-white text-brand-700 border border-slate-200 hover:bg-slate-50',
  ghost:     'text-slate-600 hover:text-brand-600 hover:bg-slate-50',
  accent:    'bg-accent-400 text-white hover:bg-accent-600',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm px-8 py-3',
}

/**
 * Class string for the button look — use on a `<Link>` or `<a>` where a real
 * <button> element isn't appropriate (keeps Server Components happy, no client JS).
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />
}
