'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { TrendingUp, Home, Users, Star } from 'lucide-react'

interface Overview {
  totalListings: number; activeListings: number; pendingReview: number
  totalUsers: number; totalAgents: number
  listingsByCity: { city: string; count: number }[]
}

// Simple bar chart using divs — no external chart library needed
function BarChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
  return (
    <div className="space-y-3">
      {data.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24 shrink-0 truncate text-right">{item.label}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
            <div  
              className="h-full bg-brand-400 rounded-lg transition-all duration-700 flex items-center"
              style={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }}>
            </div>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
              {item.value.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Status donut using conic-gradient
function DonutChart({ active, pending, rejected, total }: { active: number; pending: number; rejected: number; total: number }) {
  const activePct  = total > 0 ? (active  / total) * 360 : 0
  const pendingPct = total > 0 ? (pending / total) * 360 : 0
  const rejectPct  = total > 0 ? (rejected/ total) * 360 : 0

  const activeEnd  = activePct
  const pendingEnd = activeEnd  + pendingPct
  const rejectEnd  = pendingEnd + rejectPct

  const gradient = `conic-gradient(
    #22c55e 0deg ${activeEnd}deg,
    #f59e0b ${activeEnd}deg ${pendingEnd}deg,
    #ef4444 ${pendingEnd}deg ${rejectEnd}deg,
    #e5e7eb ${rejectEnd}deg 360deg
  )`

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-28 h-28 shrink-0">
        <div className="w-28 h-28 rounded-full" style={{ background: gradient }} />
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700">{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Active',   value: active,   color: 'bg-green-400' },
          { label: 'Pending',  value: pending,  color: 'bg-amber-400' },
          { label: 'Rejected', value: rejected, color: 'bg-red-400'   },
          { label: 'Other',    value: total - active - pending - rejected, color: 'bg-gray-200' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-xs font-medium text-gray-700 ml-auto pl-4">
              {item.value.toLocaleString()} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Overview | null>(null)

  useEffect(() => { adminApi.getOverview().then(r => setData(r.data)).catch(() => {}) }, [])

  const cityData  = data?.listingsByCity.slice(0, 8).map(c => ({ label: c.city, value: Number(c.count) })) ?? []
  const maxCity   = cityData.length ? Math.max(...cityData.map(c => c.value)) : 1

  const kpis = [
    { label: 'Total listings', value: data?.totalListings ?? 0,  icon: <Home size={16} className="text-brand-600" />,   color: 'bg-brand-50'  },
    { label: 'Active',         value: data?.activeListings ?? 0, icon: <TrendingUp size={16} className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Total users',    value: data?.totalUsers ?? 0,     icon: <Users size={16} className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Agents',         value: data?.totalAgents ?? 0,    icon: <Star size={16} className="text-amber-500" />,  color: 'bg-amber-50'  },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Platform performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>{kpi.icon}</div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{kpi.value.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listing status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Listing status breakdown</h2>
          {data ? (
            <DonutChart
              total={data.totalListings}
              active={data.activeListings}
              pending={data.pendingReview}
              rejected={Math.max(data.totalListings - data.activeListings - data.pendingReview, 0)}
            />
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-gray-300">Loading...</div>
          )}
        </div>

        {/* Top cities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-5">Active listings by city</h2>
          {cityData.length > 0
            ? <BarChart data={cityData} maxVal={maxCity} />
            : <div className="h-32 flex items-center justify-center text-sm text-gray-300">No data yet</div>}
        </div>
      </div>

      {/* Metrics summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Key metrics summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Approval rate',      value: data ? `${Math.round((data.activeListings / Math.max(data.totalListings, 1)) * 100)}%` : '—' },
            { label: 'Pending rate',       value: data ? `${Math.round((data.pendingReview  / Math.max(data.totalListings, 1)) * 100)}%` : '—' },
            { label: 'Agent-to-user ratio',value: data ? `1:${Math.round(data.totalUsers / Math.max(data.totalAgents, 1))}` : '—' },
            { label: 'Cities covered',     value: data?.listingsByCity.length ?? '—' },
          ].map(m => (
            <div key={m.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xl font-semibold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-400 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
