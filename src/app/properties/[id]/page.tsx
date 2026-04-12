import { notFound } from 'next/navigation'
import { MapPin, Bed, Bath, Maximize2, Calendar, Car, Layers, BadgeCheck, Eye, MessageCircle, Phone } from 'lucide-react'
import { propertyApi } from '@/lib/api'
import PropertyCard from '@/components/property/PropertyCard'
import InquiryForm from '@/components/property/InquiryForm'
import { formatPrice, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, FURNISHING_LABELS, listingTypeBadgeClass } from '@/lib/utils'

interface Props { params: Promise<{ id: string }> }

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  let property
  let similar: import('@/types').PropertyCard[] = []
  try {
    const pRes = await propertyApi.getById(id)
    property = pRes.data
  } catch { notFound() }
  try {
    const sRes = await propertyApi.getSimilar(id)
    similar = sRes.data
  } catch { similar = [] }

  const primaryImage = property.images.find(i => i.isPrimary) ?? property.images[0]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gallery */}
          <div>
            <div className="relative h-80 md:h-96 bg-gray-100 rounded-2xl overflow-hidden">
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primaryImage.url} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-200" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${listingTypeBadgeClass(property.listingType)}`}>
                  {LISTING_TYPE_LABELS[property.listingType]}
                </span>
                {property.isFeatured && <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Featured</span>}
              </div>
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {property.images.map(img => (
                  <div key={img.id} className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & price */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{property.title}</h1>
                <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={14} />
                  {property.addressLine ?? `${property.localityName}, ${property.cityName}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-600">{formatPrice(property.price, property.priceUnit)}</p>
                {property.priceNegotiable && <span className="text-xs text-green-600 font-medium">Negotiable</span>}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye size={12} />{property.viewsCount} views</span>
              <span className="flex items-center gap-1"><MessageCircle size={12} />{property.inquiryCount} inquiries</span>
              {property.isVerified && <span className="flex items-center gap-1 text-brand-600"><BadgeCheck size={12} />Verified listing</span>}
            </div>
          </div>

          {/* Key specs */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Property details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-2"><Bed size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Bedrooms</p><p className="text-sm font-medium">{property.bedrooms} BHK</p></div></div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-2"><Bath size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Bathrooms</p><p className="text-sm font-medium">{property.bathrooms}</p></div></div>
              )}
              <div className="flex items-center gap-2"><Maximize2 size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Area</p><p className="text-sm font-medium">{property.areaSqft.toLocaleString()} sqft</p></div></div>
              <div className="flex items-center gap-2"><Layers size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Floor</p><p className="text-sm font-medium">{property.floorNumber ?? '—'} / {property.totalFloors ?? '—'}</p></div></div>
              <div className="flex items-center gap-2"><Car size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Parking</p><p className="text-sm font-medium">{property.parkingAvailable ? 'Available' : 'Not available'}</p></div></div>
              {property.availableFrom && (
                <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-400 shrink-0" /><div><p className="text-xs text-gray-400">Available from</p><p className="text-sm font-medium">{new Date(property.availableFrom).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p></div></div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-200">
              {[
                { label: 'Property type',   value: PROPERTY_TYPE_LABELS[property.propertyType] },
                { label: 'Furnishing',      value: FURNISHING_LABELS[property.furnishing]       },
                { label: 'Facing',          value: property.facing ?? '—'                       },
                { label: 'Age of property', value: property.ageOfProperty ? `${property.ageOfProperty} yrs` : '—' },
                ...(property.carpetAreaSqft ? [{ label: 'Carpet area', value: `${property.carpetAreaSqft} sqft` }] : []),
                ...(property.balconies      ? [{ label: 'Balconies',   value: String(property.balconies)         }] : []),
              ].map(item => (
                <div key={item.label}><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium text-gray-800">{item.value}</p></div>
              ))}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">About this property</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(a => (
                  <span key={a.id} className="bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 text-xs font-medium">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Owner */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                {property.owner.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{property.owner.name}</p>
                <p className="text-xs text-gray-400 capitalize">{property.owner.role === 'AGENT' ? 'Verified agent' : 'Owner'}</p>
              </div>
            </div>
            {property.owner.phone && (
              <a href={`tel:${property.owner.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
                <Phone size={15} /> View contact
              </a>
            )}
          </div>

          {/* Inquiry */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">Send inquiry</h3>
            <InquiryForm propertyId={property.id} />
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Similar properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
