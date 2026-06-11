'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'

export default function Navbar() {
  const { isLoggedIn, user, logout, _hasHydrated } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropOpen) return
    function handleOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [dropOpen])

  function handleLogout() { logout(); router.push('/') }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-brand-600">Prop</span>
          <span className="text-xl font-bold text-accent-400">Find</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[['Buy','/properties?listingType=SALE'],['Rent','/properties?listingType=RENT'],['PG','/properties?listingType=PG'],['Post property','/post-property']].map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Render nothing until Zustand hydrates to avoid flashing Login/Register
              buttons for users who are already signed in. */}
          {_hasHydrated && isLoggedIn && user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 text-sm border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-slate-700">{user.name}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-card py-1 z-50">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <LayoutDashboard size={14} /> My listings
                  </Link>
                  <Link href="/post-property" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <PlusCircle size={14} /> Post property
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-slate-50">
                      <LayoutDashboard size={14} /> Admin panel
                    </Link>
                  )}
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-50">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : _hasHydrated ? (
            <>
              <Link href="/auth/login" className={buttonClasses('secondary', 'md')}>Login</Link>
              <Link href="/auth/register" className={buttonClasses('primary', 'md')}>Register</Link>
            </>
          ) : null}
        </div>

        <button className="md:hidden p-2 text-slate-500" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {[['Buy','/properties?listingType=SALE'],['Rent','/properties?listingType=RENT'],['PG','/properties?listingType=PG'],['Post property','/post-property']].map(([label, href]) => (
            <Link key={href} href={href} className="block py-2 text-sm text-slate-700" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {_hasHydrated && isLoggedIn ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-slate-700" onClick={() => setMenuOpen(false)}>My listings</Link>
              <button onClick={handleLogout} className="block py-2 text-sm text-red-600 w-full text-left">Logout</button>
            </>
          ) : _hasHydrated ? (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login"    className={buttonClasses('secondary', 'md', 'flex-1')} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/register" className={buttonClasses('primary', 'md', 'flex-1')} onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  )
}
