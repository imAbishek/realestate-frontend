'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { propertyApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { formatPrice, LISTING_TYPE_LABELS, timeAgo } from '@/lib/utils'
import type { PropertyCard, Page } from '@/types'
import { PlusCircle, Eye, Trash2, Edit, BadgeCheck, Clock, XCircle } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  ACTIVE:         { label: 'Active',        cls: 'bg-green-50 text-green-700 border-green-200',  icon: <BadgeCheck size={12} /> },
  PENDING_REVIEW: { label: 'Under review',  cls: 'bg-amber-50  text-amber-700  border-amber-200', icon: <Clock size={12} /> },
  REJECTED:       { label: 'Rejected',      cls: 'bg-red-50    text-red-700    border-red-200',   icon: <XCircle size={12} /> },
  EXPIRED:        { label: 'Expired',       cls: 'bg-gray-50   text-gray-500   border-gray-200',  icon: <Clock size={12} /> },
  DRAFT:          { label: 'Draft',         cls: 'bg-gray-50   text-gray-500   border-gray-200',  icon: null },
  SOLD_RENTED:    { label: 'Sold / Rented', cls: 'bg-brand-50  text-brand-700  border-brand-200', icon: <BadgeCheck size={12} /> },
}

export default function DashboardPage() {
  const router = useRouter()
  const { isLoggedIn, user, _hasHydrated } = useAuthStore()
  const [data,    setData]    = useState<Page<PropertyCard> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(0)

  useEffect(() => { if (_hasHydrated && !isLoggedIn) router.push('/auth/login') }, [_hasHydrated, isLoggedIn, router])

  useEffect(() => {
    if (!_hasHydrated) return
    propertyApi.myListings(page, 10)
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false))
  }, [page, _hasHydrated])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await propertyApi.delete(id)
      toast.success('Listing deleted')
      setData(prev => prev ? { ...prev, content: prev.content.filter(p => p.id !== id) } : prev)
    } catch { toast.error('Could not delete listing') }
  }

  if (!isLoggedIn) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My listings</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name.split(' ')[0]}</p>
        </div>
        <Link href="/post-property"
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
          <PlusCircle size={16} /> Post new property
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total listings', value: data?.totalElements ?? '—' },
          { label: 'Active',         value: data?.content.filter(p => p.status === 'ACTIVE').length   != null ? `${data!.content.filter(p => p.status === 'ACTIVE').length}${data!.totalPages > 1 ? '+' : ''}` : '—' },
          { label: 'Under review',   value: data?.content.filter(p => p.status === 'PENDING_REVIEW').length != null ? `${data!.content.filter(p => p.status === 'PENDING_REVIEW').length}${data!.totalPages > 1 ? '+' : ''}` : '—' },
          { label: 'Total views',    value: data?.content.reduce((sum, p) => sum + p.viewsCount, 0).toLocaleString() ?? '—' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">All listings</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : data?.content.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">You haven&apos;t posted any listings yet.</p>
            <Link href="/post-property"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800">
              <PlusCircle size={15} /> Post your first property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data?.content.map(property => {
              const status     = property.status || 'PENDING_REVIEW'
              const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING_REVIEW
              return (
                <div key={property.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {property.primaryImageUrl ? (
                      <img src={property.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{property.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {property.localityName}, {property.cityName} · {LISTING_TYPE_LABELS[property.listingType]} · {formatPrice(property.price, property.priceUnit)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Posted {timeAgo(property.createdAt)}</p>
                  </div>

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusConf.cls}`}>
                    {statusConf.icon}{statusConf.label}
                  </span>

                  {/* Views */}
                  <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Eye size={13} />{property.viewsCount}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {status === 'ACTIVE' ? (
                      <Link href={`/properties/${property.id}`}
                        className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View listing">
                        <Eye size={15} />
                      </Link>
                    ) : (
                      <span className="p-2 text-gray-200 cursor-not-allowed" title="Not live yet">
                        <Eye size={15} />
                      </span>
                    )}
                    <Link href={`/post-property/edit/${property.id}`}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => handleDelete(property.id, property.title)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Page {page + 1} of {data.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={data.first} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button disabled={data.last} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
