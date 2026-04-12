'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Menu, X, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { isLoggedIn, user, logout, _hasHydrated } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const router = useRouter()

  function handleLogout() { logout(); router.push('/') }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold text-brand-600">Prop</span>
          <span className="text-xl font-semibold text-accent-400">Find</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[['Buy','/properties?listingType=SALE'],['Rent','/properties?listingType=RENT'],['PG','/properties?listingType=PG'],['Post property','/post-property']].map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Render nothing until Zustand hydrates to avoid flashing Login/Register
              buttons for users who are already signed in. */}
          {_hasHydrated && isLoggedIn && user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-medium">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard size={14} /> My listings
                  </Link>
                  <Link href="/post-property" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <PlusCircle size={14} /> Post property
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-gray-50">
                      <LayoutDashboard size={14} /> Admin panel
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : _hasHydrated ? (
            <>
              <Link href="/auth/login" className="text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">Login</Link>
              <Link href="/auth/register" className="text-sm text-white bg-brand-600 rounded-lg px-4 py-2 hover:bg-brand-800">Register</Link>
            </>
          ) : null}
        </div>

        <button className="md:hidden p-2 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {[['Buy','/properties?listingType=SALE'],['Rent','/properties?listingType=RENT'],['PG','/properties?listingType=PG'],['Post property','/post-property']].map(([label, href]) => (
            <Link key={href} href={href} className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {_hasHydrated && isLoggedIn ? (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>My listings</Link>
              <button onClick={handleLogout} className="block py-2 text-sm text-red-600 w-full text-left">Logout</button>
            </>
          ) : _hasHydrated ? (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login"    className="flex-1 text-center border rounded-lg py-2 text-sm">Login</Link>
              <Link href="/auth/register" className="flex-1 text-center bg-brand-600 text-white rounded-lg py-2 text-sm">Register</Link>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  )
}
