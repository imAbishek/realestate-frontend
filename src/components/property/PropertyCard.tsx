import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize2, BadgeCheck } from 'lucide-react'
import type { PropertyCard } from '@/types'
import { formatPrice, listingTypeBadgeClass, LISTING_TYPE_LABELS, bedroomLabel } from '@/lib/utils'

export default function PropertyCard({ property }: { property: PropertyCard }) {
  const { id, title, listingType, price, priceUnit, bedrooms, bathrooms, areaSqft,
          localityName, cityName, primaryImageUrl, isFeatured, isVerified } = property
  return (
    <Link href={`/properties/${id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-200 hover:shadow-md transition-all duration-200 block">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryImageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg className="w-12 h-12 text-gray-200" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${listingTypeBadgeClass(listingType)}`}>{LISTING_TYPE_LABELS[listingType]}</span>
          {isFeatured && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Featured</span>}
        </div>
        {isVerified && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm">
            <BadgeCheck size={16} className="text-brand-600" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-lg font-semibold text-brand-600 mb-1">{formatPrice(price, priceUnit)}</p>
        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">{title}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3"><MapPin size={12} />{localityName}, {cityName}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
          {bedrooms !== null && <span className="flex items-center gap-1 text-xs text-gray-500"><Bed size={13} />{bedroomLabel(bedrooms)}</span>}
          {bathrooms !== null && <span className="flex items-center gap-1 text-xs text-gray-500"><Bath size={13} />{bathrooms} Bath</span>}
          <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto"><Maximize2 size={13} />{areaSqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </Link>
  )
}
