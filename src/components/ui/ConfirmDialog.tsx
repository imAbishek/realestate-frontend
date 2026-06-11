'use client'
import { useEffect, useState } from 'react'
import { AlertTriangle, ShieldQuestion, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** danger = red confirm button + warning icon (destructive actions) */
  tone?: 'danger' | 'primary'
  /** Show a reason textarea; its value is passed to onConfirm. */
  withReason?: boolean
  reasonPlaceholder?: string
  /** When true the confirm button stays disabled until a reason is typed. */
  reasonRequired?: boolean
  onConfirm: (reason?: string) => void | Promise<void>
  onClose: () => void
}

/**
 * Branded replacement for window.confirm()/prompt() — backdrop + centered card,
 * Escape/backdrop-click to dismiss, optional reason field for reject/cancel flows.
 */
export default function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  tone = 'primary', withReason = false,
  reasonPlaceholder = 'Add a reason...', reasonRequired = false,
  onConfirm, onClose,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  // Fresh state every time the dialog opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) { setReason(''); setBusy(false) } }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const danger = tone === 'danger'
  const Icon = danger ? AlertTriangle : ShieldQuestion

  async function confirm() {
    setBusy(true)
    try { await onConfirm(withReason ? reason.trim() || undefined : undefined) }
    finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <X size={16} />
        </button>

        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4',
          danger ? 'bg-red-50' : 'bg-brand-50')}>
          <Icon className={cn('w-5 h-5', danger ? 'text-red-600' : 'text-brand-600')} />
        </div>

        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {message && <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{message}</p>}

        {withReason && (
          <textarea
            value={reason} onChange={e => setReason(e.target.value)}
            placeholder={reasonPlaceholder} rows={3} autoFocus
            className="mt-4 w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none
              focus:border-brand-400 focus:ring-2 focus:ring-brand-200 placeholder:text-slate-400 resize-none" />
        )}

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button size="sm" onClick={confirm}
            disabled={busy || (withReason && reasonRequired && !reason.trim())}
            className={danger ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-200' : undefined}>
            {busy ? 'Working...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
