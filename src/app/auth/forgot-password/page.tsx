'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 text-sm mb-1">
            If an account exists for <span className="font-medium text-gray-700">{sentEmail}</span>,
          </p>
          <p className="text-gray-500 text-sm mb-8">
            we&apos;ve sent a 6-digit OTP to reset your password.
          </p>
          <button
            onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(sentEmail)}`)}
            className="w-full bg-brand-600 hover:bg-brand-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors mb-4"
          >
            Enter OTP &amp; reset password →
          </button>
          <p className="text-xs text-gray-400">
            Didn&apos;t receive it?{' '}
            <button onClick={() => setSent(false)} className="text-brand-600 hover:underline">
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <span className="text-2xl font-semibold text-brand-600">Prop</span>
            <span className="text-2xl font-semibold text-accent-400">Find</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-sm text-gray-500 mb-6">
            Enter the email address associated with your account and we&apos;ll send you a one-time password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoFocus
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
