'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/api'
import { Home, Users, Clock, CheckCircle, TrendingUp, Star, ArrowRight } from 'lucide-react'

interface Overview {
  totalListings: number; activeListings: number; pendingReview: number
  totalUsers: number; totalAgents: number
  listingsByCity: { city: string; count: number }[]
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null)

  useEffect(() => { adminApi.getOverview().then(r => setData(r.data)).catch(() => {}) }, [])

  const maxCount = data ? Math.max(...data.listingsByCity.map(c => Number(c.count)), 1) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Platform health at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Home size={18} className="text-brand-600" />}    label="Total listings"    value={data?.totalListings.toLocaleString() ?? '—'}  color="bg-brand-50" />
        <StatCard icon={<CheckCircle size={18} className="text-green-600" />} label="Active listings" value={data?.activeListings.toLocaleString() ?? '—'} color="bg-green-50" />
        <StatCard icon={<Clock size={18} className="text-amber-600" />}   label="Pending review"    value={data?.pendingReview ?? '—'} sub={data?.pendingReview ? 'Need your attention' : undefined} color="bg-amber-50" />
        <StatCard icon={<Users size={18} className="text-purple-600" />}  label="Total users"       value={data?.totalUsers.toLocaleString() ?? '—'}     color="bg-purple-50" />
        <StatCard icon={<Star size={18} className="text-brand-400" />}    label="Agents"            value={data?.totalAgents.toLocaleString() ?? '—'}    color="bg-brand-50" />
        <StatCard icon={<TrendingUp size={18} className="text-teal-600" />} label="Approval rate"   value={data ? `${Math.round((data.activeListings / Math.max(data.totalListings, 1)) * 100)}%` : '—'} color="bg-teal-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Listings by city</h2>
          <div className="space-y-3">
            {data?.listingsByCity.slice(0, 8).map(({ city, count }) => {
              const pct = Math.round((Number(count) / maxCount) * 100)
              return (
                <div key={city}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{city}</span>
                    <span className="text-gray-400">{Number(count).toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            }) ?? <p className="text-sm text-gray-300 py-8 text-center">No data yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Quick actions</h2>
          <div className="space-y-3">
            {[
              { href: '/admin/listings',   label: 'Review pending listings', desc: `${data?.pendingReview ?? 0} awaiting approval` },
              { href: '/admin/users',      label: 'Manage users',            desc: `${data?.totalUsers ?? 0} registered`          },
              { href: '/admin/analytics',  label: 'View full analytics',     desc: 'Traffic, revenue & conversions'                },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{a.label}</p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
                <ArrowRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
