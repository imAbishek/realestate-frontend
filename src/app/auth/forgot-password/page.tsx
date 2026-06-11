'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api'
import { MailCheck } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setSentEmail(data.email)
      setSent(true)
    } catch {
      // Always show success to prevent email enumeration (mirrors backend behaviour)
      setSentEmail(data.email)
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h1>
        <p className="text-slate-500 text-sm mb-1">
          If an account exists for <span className="font-medium text-slate-700">{sentEmail}</span>,
        </p>
        <p className="text-slate-500 text-sm mb-8">
          we&apos;ve sent a 6-digit OTP to reset your password.
        </p>
        <Button onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(sentEmail)}`)}
          className="w-full mb-4">
          Enter OTP &amp; reset password →
        </Button>
        <p className="text-xs text-slate-400">
          Didn&apos;t receive it?{' '}
          <button onClick={() => setSent(false)} className="text-brand-600 hover:underline">
            Try again
          </button>
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter the email address associated with your account and we&apos;ll send you a one-time password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            autoFocus
            className={inputCls}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
      </p>
    </Card>
  )
}
