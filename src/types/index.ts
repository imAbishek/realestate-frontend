// src/types/index.ts — mirrors Spring Boot DTOs exactly

export type ListingType     = 'SALE' | 'RENT' | 'PG'
export type PropertyType    = 'APARTMENT' | 'INDEPENDENT_HOUSE' | 'VILLA' | 'PLOT' | 'COMMERCIAL_OFFICE' | 'COMMERCIAL_SHOP' | 'BUILDER_FLOOR' | 'PG_HOSTEL'
export type FurnishingStatus = 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED'
export type ListingStatus   = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'EXPIRED' | 'REJECTED' | 'SOLD_RENTED'
export type PriceUnit       = 'TOTAL' | 'PER_MONTH' | 'PER_SQFT'
export type UserRole        = 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN'

export interface UserInfo {
  id: string; name: string; email: string; phone: string | null
  role: UserRole; isVerified: boolean; profilePhotoUrl: string | null
}

export interface AuthResponse {
  accessToken: string; refreshToken: string; tokenType: string
  expiresIn: number; user: UserInfo
}

export interface LoginRequest    { identifier: string; password: string }
export interface RegisterRequest { name: string; email: string; phone?: string; password: string }

export interface PropertyCard {
  id: string; title: string; listingType: ListingType; propertyType: PropertyType
  status: ListingStatus
  price: number; priceUnit: PriceUnit; bedrooms: number | null; bathrooms: number | null
  areaSqft: number; furnishing: FurnishingStatus; localityName: string; cityName: string
  isFeatured: boolean; isVerified: boolean; primaryImageUrl: string | null
  viewsCount: number; createdAt: string
}

export interface PropertyImage { id: string; url: string; isPrimary: boolean; sortOrder: number }
export interface Amenity       { id: string; name: string; category: string; iconKey: string }
export interface OwnerInfo     { id: string; name: string; phone: string | null; profilePhotoUrl: string | null; role: UserRole; agencyName: string | null; avgRating: number | null }

export interface PropertyDetail {
  id: string; title: string; description: string; listingType: ListingType
  propertyType: PropertyType; status: ListingStatus; rejectionReason: string | null; price: number; priceUnit: PriceUnit
  priceNegotiable: boolean; securityDeposit: number | null; bedrooms: number | null
  bathrooms: number | null; balconies: number | null; totalFloors: number | null
  floorNumber: number | null; areaSqft: number; carpetAreaSqft: number | null
  furnishing: FurnishingStatus; facing: string | null; ageOfProperty: number | null
  availableFrom: string | null; parkingAvailable: boolean; addressLine: string | null
  latitude: number | null; longitude: number | null; localityName: string; localitySlug: string
  cityName: string; citySlug: string; isFeatured: boolean; isVerified: boolean
  viewsCount: number; inquiryCount: number; images: PropertyImage[]; amenities: Amenity[]
  owner: OwnerInfo; createdAt: string; expiresAt: string
}

export interface SearchParams {
  citySlug?: string; localityId?: string; listingType?: ListingType; propertyType?: PropertyType
  minPrice?: number; maxPrice?: number; minBedrooms?: number; maxBedrooms?: number
  minArea?: number; maxArea?: number; furnishing?: FurnishingStatus
  featuredOnly?: boolean; keyword?: string; page?: number; size?: number; sort?: string
}

export interface City     { id: string; name: string; state: string; slug: string; active: boolean }
export interface Locality { id: string; name: string; slug: string; latitude: number | null; longitude: number | null; city: City }

export interface Page<T> {
  content: T[]; totalElements: number; totalPages: number
  number: number; size: number; first: boolean; last: boolean
}

export interface InquiryRequest { message: string; guestName?: string; guestEmail?: string; guestPhone?: string }
