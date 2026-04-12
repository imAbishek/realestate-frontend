'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/api'
import { formatPrice, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, FURNISHING_LABELS } from '@/lib/utils'
import type { PropertyDetail } from '@/types'
import { ArrowLeft, CheckCircle, XCircle, Star, StarOff, Bed, Bath, Maximize2, MapPin } from 'lucide-react'

const STATUS_BADGE: Record<string, string> = {
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVE:         'bg-green-50 text-green-700 border-green-200',
  REJECTED:       'bg-red-50   text-red-700   border-red-200',
  EXPIRED:        'bg-gray-50  text-gray-500  border-gray-200',
  DRAFT:          'bg-gray-50  text-gray-500  border-gray-200',
  SOLD_RENTED:    'bg-brand-50 text-brand-700 border-brand-200',
}

export default function AdminListingPreview() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    adminApi.getListing(id)
      .then(r => setProperty(r.data))
      .catch(() => { toast.error('Failed to load listing'); router.push('/admin/listings') })
      .finally(() => setLoading(false))
  }, [id, router])

  async function approve() {
    try   { await adminApi.approve(id); toast.success('Approved'); router.push('/admin/listings') }
    catch { toast.error('Failed to approve') }
  }

  async function reject() {
    const reason = prompt('Rejection reason (will be shown to the seller):')
    if (!reason?.trim()) return
    try   { await adminApi.reject(id, reason); toast.success('Rejected'); router.push('/admin/listings') }
    catch { toast.error('Failed to reject') }
  }

  async function toggleFeatured() {
    if (!property) return
    try {
      const res = await adminApi.toggleFeatured(id)
      setProperty(res.data)
      toast.success(property.isFeatured ? 'Removed from featured' : 'Marked as featured')
    } catch { toast.error('Failed to update featured') }
  }

  if (loading) return <div className="p-10 text-center text-sm text-gray-400">Loading...</div>
  if (!property) return null

  const primaryImage = property.images.find(i => i.isPrimary) ?? property.images[0]
  const displayImg   = property.images[activeImg] ?? primaryImage

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/listings"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{property.title}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />{property.localityName}, {property.cityName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_BADGE[property.status] ?? STATUS_BADGE.DRAFT}`}>
            {property.status.replace('_', ' ')}
          </span>
          {property.isFeatured && (
            <span className="text-xs font-medium px-3 py-1.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — images + details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image gallery */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              {displayImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImg.url} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-200 text-5xl">⌂</span>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button key={img.id} onClick={() => setActiveImg(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-colors
                      ${activeImg === idx ? 'border-brand-600' : 'border-transparent'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key specs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-2">
                  <Bed size={15} className="text-brand-400 shrink-0" />
                  <div><p className="text-xs text-gray-400">Bedrooms</p><p className="text-sm font-medium">{property.bedrooms} BHK</p></div>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-2">
                  <Bath size={15} className="text-brand-400 shrink-0" />
                  <div><p className="text-xs text-gray-400">Bathrooms</p><p className="text-sm font-medium">{property.bathrooms}</p></div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Maximize2 size={15} className="text-brand-400 shrink-0" />
                <div><p className="text-xs text-gray-400">Area</p><p className="text-sm font-medium">{property.areaSqft.toLocaleString()} sqft</p></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
              {[
                ['Type',        PROPERTY_TYPE_LABELS[property.propertyType]],
                ['Listing',     LISTING_TYPE_LABELS[property.listingType]],
                ['Furnishing',  FURNISHING_LABELS[property.furnishing]],
                ['Facing',      property.facing ?? '—'],
                ['Floor',       property.floorNumber != null ? `${property.floorNumber} / ${property.totalFloors ?? '?'}` : '—'],
                ['Parking',     property.parkingAvailable ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label}><p className="text-xs text-gray-400">{label}</p><p className="font-medium text-gray-800">{value}</p></div>
              ))}
            </div>
            {property.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — actions + owner */}
        <div className="space-y-4">
          {/* Price */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-bold text-brand-600">{formatPrice(property.price, property.priceUnit)}</p>
            {property.priceNegotiable && <p className="text-xs text-green-600 font-medium mt-0.5">Negotiable</p>}
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <p>{property.viewsCount} views · {property.inquiryCount} inquiries</p>
              {property.rejectionReason && (
                <p className="text-red-500">Rejected: {property.rejectionReason}</p>
              )}
            </div>
          </div>

          {/* Moderation actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</p>
            {property.status === 'PENDING_REVIEW' && (
              <>
                <button onClick={approve}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={reject}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                  <XCircle size={14} /> Reject
                </button>
              </>
            )}
            <button onClick={toggleFeatured}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
              {property.isFeatured ? <><StarOff size={14} /> Remove featured</> : <><Star size={14} /> Mark as featured</>}
            </button>
          </div>

          {/* Owner */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Owner</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium shrink-0">
                {property.owner.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{property.owner.name}</p>
                <p className="text-xs text-gray-400 capitalize">{property.owner.role.toLowerCase()}</p>
                {property.owner.phone && <p className="text-xs text-gray-400">{property.owner.phone}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
