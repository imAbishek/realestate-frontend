'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeOff } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email address'),
  phone:    z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

const inputCls = 'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await authApi.register({ name: data.name, email: data.email, phone: data.phone || undefined, password: data.password })
      const { user, accessToken, refreshToken } = res.data
      setAuth(user, accessToken, refreshToken)
      toast.success(`Welcome to PropFind, ${user.name.split(' ')[0]}! Check your email to verify.`)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Free to join — browse, post and inquire</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
          <input {...register('name')} placeholder="Rajesh Kumar" className={inputCls} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={inputCls} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile number <span className="text-slate-400 font-normal">(optional)</span></label>
          <div className="flex">
            <span className="flex items-center px-3 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-sm text-slate-500">+91</span>
            <input {...register('phone')} placeholder="9876543210"
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-r-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-colors" />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
              className={`${inputCls} pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <p className="text-xs text-slate-400">
          By creating an account you agree to our{' '}
          <Link href="/terms"   className="text-brand-600 hover:underline">Terms of use</Link> and{' '}
          <Link href="/privacy" className="text-brand-600 hover:underline">Privacy policy</Link>.
        </p>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
      </p>
    </Card>
  )
}
