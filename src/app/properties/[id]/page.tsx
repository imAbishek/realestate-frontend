import { notFound } from 'next/navigation'
import {
  MapPin, Bed, Bath, Maximize2, Car, Layers, BadgeCheck, Eye, MessageCircle,
  Ruler, Droplets, Compass, ShieldCheck,
} from 'lucide-react'
import { propertyApi } from '@/lib/api'
import PropertyCard from '@/components/property/PropertyCard'
import InquiryForm from '@/components/property/InquiryForm'
import ContactActions from '@/components/property/ContactActions'
import PropertyGallery from '@/components/property/PropertyGallery'
import Card from '@/components/ui/Card'
import Badge, { type BadgeTone } from '@/components/ui/Badge'
import {
  formatPrice, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, FURNISHING_LABELS, yesNo,
  LISTED_BY_LABELS, APPROVAL_AUTHORITY_LABELS, OWNERSHIP_TYPE_LABELS,
  SOIL_TYPE_LABELS, WATER_SOURCE_LABELS, ELECTRIC_SERVICE_LABELS,
} from '@/lib/utils'
import type { PropertyDetail, PropertyCard as PropertyCardType, ListingType } from '@/types'

interface Props { params: Promise<{ id: string }> }

const LISTING_TONE: Record<ListingType, BadgeTone> = { SALE: 'green', RENT: 'brand', PG: 'purple' }

type Spec = { label: string; value: string }

/** Branches the spec list by property type so plot/agri/promoter data actually shows. */
function buildSpecs(p: PropertyDetail): Spec[] {
  const rows: Spec[] = []
  const add = (label: string, value: string | number | null | undefined, unit = '') => {
    if (value === null || value === undefined || value === '') return
    rows.push({ label, value: `${value}${unit}` })
  }

  const isPlot = p.propertyType === 'PLOT'
  const isAgri = p.propertyType === 'AGRICULTURAL_LAND'
  const isCommercial = p.propertyType === 'COMMERCIAL_OFFICE' || p.propertyType === 'COMMERCIAL_SHOP'
  const isResidential = !isPlot && !isAgri && !isCommercial

  add('Property type', PROPERTY_TYPE_LABELS[p.propertyType])
  if (p.areaSqft) add('Total area', p.areaSqft.toLocaleString(), ' sqft')

  if (isResidential) {
    if (p.bedrooms !== null) add('Configuration', `${p.bedrooms} BHK`)
    if (p.bathrooms !== null) add('Bathrooms', p.bathrooms)
    if (p.balconies) add('Balconies', p.balconies)
    add('Floor', `${p.floorNumber ?? '—'} / ${p.totalFloors ?? '—'}`)
    add('Furnishing', FURNISHING_LABELS[p.furnishing])
    if (p.carpetAreaSqft) add('Carpet area', p.carpetAreaSqft.toLocaleString(), ' sqft')
    add('Facing', p.facing)
    if (p.ageOfProperty) add('Age', p.ageOfProperty, ' yrs')
    add('Parking', p.parkingAvailable ? 'Available' : 'Not available')
  }

  if (isCommercial) {
    add('Floor', `${p.floorNumber ?? '—'} / ${p.totalFloors ?? '—'}`)
    add('Furnishing', FURNISHING_LABELS[p.furnishing])
    add('Facing', p.facing)
    if (p.ageOfProperty) add('Age', p.ageOfProperty, ' yrs')
    add('Parking', p.parkingAvailable ? 'Available' : 'Not available')
  }

  if (isPlot) {
    if (p.plotLengthFt && p.plotBreadthFt) add('Dimensions', `${p.plotLengthFt} × ${p.plotBreadthFt} ft`)
    if (p.plotAreaCents) add('Plot area', p.plotAreaCents, ' cents')
    if (p.roadWidthFt) add('Road width', p.roadWidthFt, ' ft')
    add('Corner plot', yesNo(p.cornerPlot))
    add('Boundary wall', yesNo(p.boundaryWall))
    if (p.approvalAuthority) add('Approval', APPROVAL_AUTHORITY_LABELS[p.approvalAuthority])
    if (p.ownershipType) add('Ownership', OWNERSHIP_TYPE_LABELS[p.ownershipType])
    add('Facing', p.facing)
  }

  if (isAgri) {
    if (p.plotAreaCents) add('Land area', p.plotAreaCents, ' cents')
    if (p.soilType) add('Soil type', SOIL_TYPE_LABELS[p.soilType])
    if (p.waterSource) add('Water source', WATER_SOURCE_LABELS[p.waterSource])
    add('Well', yesNo(p.hasWell))
    if (p.electricService) add('Electricity', ELECTRIC_SERVICE_LABELS[p.electricService])
    add('Currently grown', p.cropCurrentlyGrown)
    add('Fenced', yesNo(p.fenced))
    if (p.roadWidthFt) add('Road width', p.roadWidthFt, ' ft')
    if (p.ownershipType) add('Ownership', OWNERSHIP_TYPE_LABELS[p.ownershipType])
  }

  return rows
}

/** A few headline stats with icons, branch-aware. */
function buildHighlights(p: PropertyDetail) {
  const isPlot = p.propertyType === 'PLOT'
  const isAgri = p.propertyType === 'AGRICULTURAL_LAND'
  const out: { icon: typeof Bed; label: string }[] = []

  if (p.areaSqft) out.push({ icon: Maximize2, label: `${p.areaSqft.toLocaleString()} sqft` })
  if (isPlot && p.plotLengthFt && p.plotBreadthFt) out.push({ icon: Ruler, label: `${p.plotLengthFt}×${p.plotBreadthFt} ft` })
  if ((isPlot || isAgri) && p.plotAreaCents) out.push({ icon: Compass, label: `${p.plotAreaCents} cents` })
  if (isAgri && p.waterSource) out.push({ icon: Droplets, label: WATER_SOURCE_LABELS[p.waterSource] })
  if (!isPlot && !isAgri) {
    if (p.bedrooms !== null) out.push({ icon: Bed, label: `${p.bedrooms} BHK` })
    if (p.bathrooms !== null) out.push({ icon: Bath, label: `${p.bathrooms} Bath` })
    out.push({ icon: Layers, label: `Floor ${p.floorNumber ?? '—'}/${p.totalFloors ?? '—'}` })
    out.push({ icon: Car, label: p.parkingAvailable ? 'Parking' : 'No parking' })
  }
  return out.slice(0, 4)
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  let property: PropertyDetail
  let similar: PropertyCardType[] = []
  try {
    property = (await propertyApi.getById(id)).data
  } catch { notFound() }
  try {
    similar = (await propertyApi.getSimilar(id)).data
  } catch { similar = [] }

  const specs = buildSpecs(property)
  const highlights = buildHighlights(property)
  const isPromoter = property.listedBy === 'PROMOTER'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gallery */}
          <PropertyGallery images={property.images} title={property.title}>
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <Badge tone={LISTING_TONE[property.listingType]}>{LISTING_TYPE_LABELS[property.listingType]}</Badge>
              {property.isFeatured && <Badge tone="amber">Featured</Badge>}
              {isPromoter && <Badge tone="brand">{LISTED_BY_LABELS.PROMOTER}</Badge>}
            </div>
          </PropertyGallery>

          {/* Title & price */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">{property.title}</h1>
                <p className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <MapPin size={14} />
                  {property.addressLine ?? `${property.localityName}, ${property.cityName}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-600">{formatPrice(property.price, property.priceUnit)}</p>
                {property.priceNegotiable && <span className="text-xs text-green-600 font-medium">Negotiable</span>}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Eye size={12} />{property.viewsCount} views</span>
              <span className="flex items-center gap-1"><MessageCircle size={12} />{property.inquiryCount} inquiries</span>
              {property.isVerified && <span className="flex items-center gap-1 text-brand-600"><BadgeCheck size={12} />Verified listing</span>}
            </div>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white border border-slate-100 shadow-soft rounded-xl p-3 flex items-center gap-2">
                  <h.icon size={18} className="text-brand-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-800">{h.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Property details (branched) */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Property details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
              {specs.map(s => (
                <div key={s.label}>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-sm font-medium text-slate-800">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Promoter / builder */}
          {isPromoter && (property.promoterProjectName || property.promoterReraId) && (
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <ShieldCheck size={15} className="text-brand-500" /> About the promoter
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
                {property.promoterProjectName && <div><p className="text-xs text-slate-400">Project</p><p className="text-sm font-medium text-slate-800">{property.promoterProjectName}</p></div>}
                {property.promoterReraId && <div><p className="text-xs text-slate-400">RERA ID</p><p className="text-sm font-medium text-slate-800">{property.promoterReraId}</p></div>}
                {property.promoterYearsExperience != null && <div><p className="text-xs text-slate-400">Experience</p><p className="text-sm font-medium text-slate-800">{property.promoterYearsExperience} yrs</p></div>}
                {property.promoterTotalProjects != null && <div><p className="text-xs text-slate-400">Projects delivered</p><p className="text-sm font-medium text-slate-800">{property.promoterTotalProjects}</p></div>}
                {property.promoterCitiesActive && <div><p className="text-xs text-slate-400">Active in</p><p className="text-sm font-medium text-slate-800">{property.promoterCitiesActive}</p></div>}
              </div>
            </Card>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-3">About this property</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-slate-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(a => <Badge key={a.id} tone="brand">{a.name}</Badge>)}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Owner */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
                {property.owner.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{property.owner.name}</p>
                <p className="text-xs text-slate-400 capitalize">{property.owner.role === 'AGENT' ? 'Verified agent' : 'Owner'}</p>
              </div>
            </div>
            <ContactActions
              ownerPhone={property.owner.phone}
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </Card>

          {/* Inquiry */}
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm">Send inquiry</h3>
            <InquiryForm propertyId={property.id} />
          </Card>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-5">Similar properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
