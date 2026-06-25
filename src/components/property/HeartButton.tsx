'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { favoritesApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

/**
 * Save / unsave a property. Wired to the backend /favorites endpoints.
 * Sits inside a parent <Link> on cards, so clicks must not bubble to navigation.
 */
export default function HeartButton({
  propertyId,
  size = 18,
  className,
}: {
  propertyId: string
  size?: number
  className?: string
}) {
  const { isLoggedIn, _hasHydrated } = useAuthStore()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  // Reflect the real saved state once auth has hydrated and the user is logged in.
  useEffect(() => {
    if (!_hasHydrated || !isLoggedIn) return
    let active = true
    favoritesApi.check(propertyId)
      .then(r => { if (active) setSaved(r.data.saved) })
      .catch(() => {})
    return () => { active = false }
  }, [_hasHydrated, isLoggedIn, propertyId])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/auth/login'); return }
    if (busy) return
    const next = !saved
    setSaved(next) // optimistic
    setBusy(true)
    try {
      if (next) await favoritesApi.save(propertyId)
      else await favoritesApi.unsave(propertyId)
    } catch {
      setSaved(!next) // revert
      toast.error('Could not update saved properties')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? 'Remove from saved' : 'Save property'}
      aria-pressed={saved}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white',
        className,
      )}
    >
      <Heart
        size={size}
        className={cn('transition-colors', saved ? 'fill-accent-400 text-accent-400' : 'text-slate-500')}
      />
    </button>
  )
}
