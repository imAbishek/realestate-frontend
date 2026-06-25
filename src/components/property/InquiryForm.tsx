'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { propertyApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import TextField from '@/components/ui/TextField'
import Textarea from '@/components/ui/Textarea'

const schema = z.object({
  message:    z.string().min(10, 'Please write at least 10 characters'),
  guestName:  z.string().optional(),
  guestEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  guestPhone: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function InquiryForm({ propertyId }: { propertyId: string }) {
  const { isLoggedIn, _hasHydrated } = useAuthStore()
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: 'I am interested in this property. Please share more details.' },
  })

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      await propertyApi.sendInquiry(propertyId, data)
      setSent(true)
      toast.success('Inquiry sent! The owner will contact you soon.')
    } catch { toast.error('Failed to send inquiry. Please try again.') }
    finally { setSubmitting(false) }
  }

  if (sent) return (
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p className="text-sm font-medium text-slate-800">Inquiry sent!</p>
      <p className="text-xs text-slate-400 mt-1">The owner will contact you soon.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Textarea {...register('message')} rows={3} placeholder="Write your message..." />
      {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      {/* Only render guest fields after Zustand has hydrated from localStorage.
          Without this guard, logged-in users see a flash of guest input fields
          because isLoggedIn is false until the persist middleware rehydrates. */}
      {_hasHydrated && !isLoggedIn && (
        <>
          <TextField {...register('guestName')}  placeholder="Your name" />
          <TextField {...register('guestPhone')} placeholder="Your phone number" />
          <TextField {...register('guestEmail')} placeholder="Your email (optional)" />
        </>
      )}
      <button type="submit" disabled={submitting}
        className="w-full bg-accent-400 hover:bg-accent-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
        {submitting ? 'Sending...' : 'Send inquiry'}
      </button>
    </form>
  )
}
