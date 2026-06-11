'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const schema = z.object({
  email:       z.string().email('Enter a valid email address'),
  otp:         z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirm:     z.string(),
}).refine(d => d.newPassword === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: searchParams.get('email') ?? '' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await authApi.resetPassword(data.email, data.otp, data.newPassword)
      toast.success('Password reset successfully! You can now sign in.')
      router.push('/auth/login')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Invalid or expired OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter the 6-digit OTP sent to your email and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={inputCls} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* OTP */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">One-time password (OTP)</label>
          <input
            {...register('otp')}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className={`${inputCls} tracking-widest text-center text-lg font-mono`}
          />
          {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>}
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
          <input
            {...register('confirm')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your new password"
            className={inputCls}
          />
          {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Didn&apos;t get the OTP?{' '}
        <Link href="/auth/forgot-password" className="text-brand-600 font-medium hover:underline">
          Resend
        </Link>
      </p>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
