'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Shown when value is '' (and rendered as the first, clearable option). */
  placeholder?: string
  /** Optional leading icon node (e.g. <MapPin size={16} />). */
  icon?: React.ReactNode
  /** Extra classes for the trigger button. */
  className?: string
  /** Visually lighter trigger (no border/bg) for use inside an already-bordered row. */
  bare?: boolean
  /** Trigger density. 'sm' for compact toolbars (e.g. sort), 'md' (default) for forms. */
  size?: 'sm' | 'md'
  /** When true the value can't be cleared — no empty placeholder option in the list. */
  required?: boolean
  disabled?: boolean
  'aria-label'?: string
}

/**
 * Themed dropdown — replaces native <select> so the OPEN popup matches the brand
 * theme (native <select> menus are OS-rendered and can't be styled). Dependency-free,
 * keyboard accessible (Up/Down/Enter/Esc/Home/End), click-outside to close.
 */
export default function Select({
  value, onChange, options, placeholder = 'Select…', icon,
  className, bare = false, size = 'md', required = false, disabled = false, ...aria
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0) // highlighted index while open
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  // Placeholder behaves as a real, selectable "clear" option at the top — unless
  // the field is required (e.g. sort), where an empty value makes no sense.
  const items: SelectOption[] = required ? options : [{ value: '', label: placeholder }, ...options]
  const selected = items.find(o => o.value === value)

  // Open the menu with the current selection pre-highlighted.
  function openMenu() {
    setActive(Math.max(0, items.findIndex(o => o.value === value)))
    setOpen(true)
  }

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open || !listRef.current) return
    const node = listRef.current.children[active] as HTMLElement | undefined
    node?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function commit(idx: number) {
    onChange(items[idx].value)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openMenu()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive(a => Math.min(items.length - 1, a + 1)); break
      case 'ArrowUp':   e.preventDefault(); setActive(a => Math.max(0, a - 1)); break
      case 'Home':      e.preventDefault(); setActive(0); break
      case 'End':       e.preventDefault(); setActive(items.length - 1); break
      case 'Enter':     e.preventDefault(); commit(active); break
      case 'Escape':    e.preventDefault(); setOpen(false); break
      case 'Tab':       setOpen(false); break
    }
  }

  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
  const triggerCls = bare
    ? cn('w-full flex items-center gap-2 text-left bg-transparent outline-none', size === 'sm' ? 'py-1.5 text-xs' : 'py-2.5 text-sm')
    : cn('w-full flex items-center gap-2 text-left bg-white border border-slate-200 rounded-xl outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-50', pad)

  return (
    <div ref={rootRef} className={cn('relative', bare && 'flex-1 min-w-0')}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (disabled) return; if (open) setOpen(false); else openMenu() }}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={cn(triggerCls, disabled && 'opacity-60 pointer-events-none', className)}
        {...aria}
      >
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
        <span className={cn('flex-1 min-w-0 truncate', !selected || selected.value === '' ? 'text-slate-400' : 'text-slate-700')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={cn('shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          className="absolute z-30 mt-1.5 w-full max-h-64 overflow-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-card"
        >
          {items.map((o, i) => {
            const isSelected = o.value === value
            const isActive = i === active
            return (
              <li
                key={o.value || '__placeholder'}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => { e.preventDefault(); commit(i) }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer select-none',
                  isActive && 'bg-brand-50',
                  isSelected ? 'text-brand-600 font-medium' : 'text-slate-700',
                  o.value === '' && 'text-slate-400',
                )}
              >
                <span className="flex-1 min-w-0 truncate">{o.label}</span>
                {isSelected && o.value !== '' && <Check size={15} className="shrink-0 text-brand-600" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
