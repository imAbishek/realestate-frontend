'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Home, Users, BarChart2,
  Star, LogOut, ShieldCheck, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { href: '/admin',           label: 'Overview',    icon: LayoutDashboard },
  { href: '/admin/listings',  label: 'Listings',    icon: Home            },
  { href: '/admin/users',     label: 'Users',       icon: Users           },
  { href: '/admin/analytics', label: 'Analytics',   icon: BarChart2       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, logout, _hasHydrated } = useAuthStore()
  const router   = useRouter()
  const pathname = usePathname()
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    if (_hasHydrated && (!isLoggedIn || user?.role !== 'ADMIN')) router.push('/')
  }, [_hasHydrated, isLoggedIn, user, router])

  if (!_hasHydrated) return null
  if (!isLoggedIn || user?.role !== 'ADMIN') return null

  function Sidebar({ mobile = false }: { mobile?: boolean }) {
    return (
      <aside className={`${mobile ? 'w-full' : 'w-56 shrink-0'} bg-gray-900 min-h-screen flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
          <ShieldCheck size={18} className="text-brand-400" />
          <div>
            <p className="text-white text-sm font-semibold">PropFind</p>
            <p className="text-gray-500 text-xs">Admin panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${active
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-medium">
              {user?.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/') }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 h-full w-56 z-30">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-56"><Sidebar mobile /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 bg-gray-900 px-4 py-3 sticky top-0 z-20">
          <button onClick={() => setSideOpen(true)} className="text-white">
            <Menu size={20} />
          </button>
          <span className="text-white text-sm font-medium">Admin panel</span>
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
