'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Phone, MessageCircle, CalendarCheck, X } from 'lucide-react'
import { bookingsApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

// Booking needs a name plus a phone OR email — mirrors the backend BookSiteVisitRequest
// rule (a logged-in profile without a phone would otherwise submit no reachable contact).
const schema = z.object({
  contactName:     z.string().min(1, 'Your name is required'),
  contactPhone:    z.string().optional(),
  contactEmail:    z.string().email('Enter a valid email').optional().or(z.literal('')),
  preferredDate:   z.string().optional(),
  preferredWindow: z.string().optional(),
  notes:           z.string().optional(),
}).refine(d => !!(d.contactPhone?.trim() || d.contactEmail?.trim()), {
  message: 'Share a phone or email so the owner can reach you',
  path: ['contactPhone'],
})
type FormData = z.infer<typeof schema>

export default function ContactActions({
  ownerPhone, propertyId, propertyTitle,
}: {
  ownerPhone: string | null; propertyId: string; propertyTitle: string
}) {
  const { user, isLoggedIn, _hasHydrated } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 10-digit Indian numbers get a 91 country code for tel:/wa.me — matches the mobile app.
  const digits = (ownerPhone || '').replace(/\D/g, '')
  const fullPhone = digits ? (digits.length === 10 ? `91${digits}` : digits) : ''

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function openSheet() {
    // Prefill from the logged-in profile each time the sheet opens.
    reset({
      contactName:  isLoggedIn ? (user?.name ?? '') : '',
      contactPhone: isLoggedIn ? (user?.phone ?? '') : '',
      contactEmail: '', preferredDate: '', preferredWindow: '', notes: '',
    })
    setOpen(true)
  }

  function whatsapp() {
    const text = encodeURIComponent(`Hi, I'm interested in your listing "${propertyTitle}" on PropFind.`)
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank', 'noopener')
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      await bookingsApi.book(propertyId, {
        contactName:     data.contactName.trim(),
        contactPhone:    data.contactPhone?.trim() || undefined,
        contactEmail:    data.contactEmail?.trim() || undefined,
        preferredDate:   data.preferredDate?.trim() || undefined,
        preferredWindow: data.preferredWindow?.trim() || undefined,
        notes:           data.notes?.trim() || undefined,
      })
      toast.success('Visit requested! The owner will reach out to confirm a slot.')
      setOpen(false)
      reset()
    } catch {
      toast.error('Could not request the visit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400'

  return (
    <div className="space-y-2.5">
      {fullPhone && (
        <div className="grid grid-cols-2 gap-2">
          <a href={`tel:+${fullPhone}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-brand-600 text-brand-700 text-sm font-medium hover:bg-brand-50 transition-colors">
            <Phone size={15} /> Call
          </a>
          <button type="button" onClick={whatsapp}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors"
            style={{ borderColor: '#25D366', color: '#1ba952' }}>
            <MessageCircle size={15} /> WhatsApp
          </button>
        </div>
      )}
      <button type="button" onClick={openSheet}
        className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
        <CalendarCheck size={15} /> Book visit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/45" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-slate-800">Book a site visit</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
              <p className="text-xs text-slate-400 line-clamp-2">{propertyTitle}</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Preferred date</label>
                  <input {...register('preferredDate')} placeholder="e.g. Sat, 14 Jun" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Preferred time</label>
                  <input {...register('preferredWindow')} placeholder="e.g. 11 AM – 12:30 PM" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Your name</label>
                <input {...register('contactName')} placeholder="Full name" className={inputCls} />
                {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                <input {...register('contactPhone')} placeholder="10-digit mobile" className={inputCls} />
                {errors.contactPhone && <p className="text-xs text-red-500 mt-1">{errors.contactPhone.message}</p>}
              </div>

              {/* Logged-in users contact via their profile; guests may leave an email instead of a phone. */}
              {_hasHydrated && !isLoggedIn && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email (optional)</label>
                  <input {...register('contactEmail')} placeholder="you@example.com" className={inputCls} />
                  {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail.message}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
                <textarea {...register('notes')} rows={3} placeholder="Any specific questions for the owner?" className={inputCls + ' resize-none'} />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-accent-400 hover:bg-accent-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                {submitting ? 'Requesting...' : 'Request site visit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
