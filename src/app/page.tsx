import Link from 'next/link'
import { propertyApi, searchApi } from '@/lib/api'
import PropertyCard from '@/components/property/PropertyCard'
import SearchBar from '@/components/search/SearchBar'
import type { PropertyCard as PropertyCardType, City } from '@/types'

export default async function HomePage() {
  const [featuredRes, citiesRes] = await Promise.allSettled([
    propertyApi.getFeatured(),
    searchApi.cities(),
  ])
  const featured: PropertyCardType[] = featuredRes.status === 'fulfilled' ? featuredRes.value.data : []
  const cities: City[]               = citiesRes.status  === 'fulfilled' ? citiesRes.value.data.slice(0, 8) : []

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight">Find your perfect home</h1>
          <p className="text-brand-200 text-lg">Over 1.2 lakh properties across India</p>
        </div>
        <div className="max-w-2xl mx-auto"><SearchBar /></div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[['1.2L+','Active listings'],['48','Cities covered'],['8,200+','Verified agents'],['3.4L+','Happy buyers']].map(([v,l]) => (
            <div key={l}><p className="text-2xl font-semibold text-white">{v}</p><p className="text-sm text-brand-200 mt-0.5">{l}</p></div>
          ))}
        </div>
      </section>

      {/* Cities */}
      {cities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Browse by city</h2>
            <Link href="/properties" className="text-sm text-brand-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map(city => (
              <Link key={city.id} href={`/properties?citySlug=${city.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-brand-600" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="10" width="4" height="6" rx="1" fill="currentColor" opacity="0.5"/>
                    <rect x="7" y="6"  width="4" height="10" rx="1" fill="currentColor"/>
                    <rect x="12" y="8" width="4" height="8"  rx="1" fill="currentColor" opacity="0.7"/>
                  </svg>
                </div>
                <p className="font-medium text-gray-800 text-sm group-hover:text-brand-600 transition-colors">{city.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{city.state}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Featured properties</h2>
              <Link href="/properties?featuredOnly=true" className="text-sm text-brand-600 hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-brand-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Own a property? List it for free</h2>
            <p className="text-brand-100 text-sm">Reach lakhs of buyers and renters. Get inquiries directly.</p>
          </div>
          <Link href="/post-property" className="bg-white text-brand-600 font-medium px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors whitespace-nowrap text-sm">
            Post your property →
          </Link>
        </div>
      </section>
    </div>
  )
}
