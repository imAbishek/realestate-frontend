import type { ListingType, PropertyType, FurnishingStatus, PriceUnit } from '@/types'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) { return clsx(inputs) }

export function formatPrice(price: number, unit: PriceUnit = 'TOTAL'): string {
  const f = price >= 10_000_000
    ? `₹${(price / 10_000_000).toFixed(2)} Cr`
    : price >= 100_000
    ? `₹${(price / 100_000).toFixed(2)} Lac`
    : `₹${price.toLocaleString('en-IN')}`
  return unit === 'PER_MONTH' ? `${f}/mo` : f
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  SALE: 'For sale', RENT: 'For rent', PG: 'PG / Co-living',
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment', INDEPENDENT_HOUSE: 'Independent house', VILLA: 'Villa',
  PLOT: 'Plot', COMMERCIAL_OFFICE: 'Commercial office', COMMERCIAL_SHOP: 'Commercial shop',
  BUILDER_FLOOR: 'Builder floor', PG_HOSTEL: 'PG / Hostel',
}

export const FURNISHING_LABELS: Record<FurnishingStatus, string> = {
  UNFURNISHED: 'Unfurnished', SEMI_FURNISHED: 'Semi-furnished', FULLY_FURNISHED: 'Fully furnished',
}

export function listingTypeBadgeClass(type: ListingType): string {
  return { SALE: 'bg-green-50 text-green-800 border border-green-200', RENT: 'bg-brand-50 text-brand-800 border border-brand-200', PG: 'bg-purple-50 text-purple-800 border border-purple-200' }[type]
}

export function bedroomLabel(bedrooms: number | null): string {
  if (bedrooms === null) return ''
  return bedrooms === 0 ? 'Studio' : `${bedrooms} BHK`
}

export function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}
