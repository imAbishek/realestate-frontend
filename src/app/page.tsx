import Link from 'next/link'
import { MapPin, ShieldCheck, HandCoins, CalendarCheck, Calculator } from 'lucide-react'
import { propertyApi, searchApi } from '@/lib/api'
import PropertyCard from '@/components/property/PropertyCard'
import SearchBar from '@/components/search/SearchBar'
import Section from '@/components/ui/Section'
import Stat from '@/components/ui/Stat'
import { buttonClasses } from '@/components/ui/Button'
import type { PropertyCard as PropertyCardType, City, Locality, Page } from '@/types'

// ISR: re-render at most every 5 minutes. Without this the page is statically baked
// ONCE at build time — and the Render free-tier backend sleeps after 15 idle minutes,
// so build-time fetches time out and the page ships permanently with 0 listings,
// "—" localities, and no Featured/Browse-by-locality sections.
export const revalidate = 300

export default async function HomePage() {
  const [featuredRes, citiesRes, countRes] = await Promise.allSettled([
    propertyApi.getFeatured(),
    searchApi.cities(),
    propertyApi.search({ size: 1 }),
  ])

  // If the backend is unreachable during a background ISR regeneration, throw so
  // Next keeps serving the last good page instead of caching a zeroed one. The
  // failed request still wakes Render, so the next regeneration succeeds. (Never
  // throw at build time or in dev — an asleep backend must not fail the build.)
  const allFailed = [featuredRes, citiesRes, countRes].every(r => r.status === 'rejected')
  if (allFailed && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('Backend unreachable — keeping the previously rendered homepage')
  }

  const featured: PropertyCardType[] = featuredRes.status === 'fulfilled' ? featuredRes.value.data : []
  const cities: City[]               = citiesRes.status  === 'fulfilled' ? citiesRes.value.data : []
  const totalListings: number        = countRes.status   === 'fulfilled' ? (countRes.value.data as Page<PropertyCardType>).totalElements : 0

  // Coimbatore-only product → pin to Coimbatore explicitly (the seed DB also holds
  // other cities, so never just take cities[0]). Falls back to the first city only
  // if a Coimbatore record isn't present.
  const primaryCity = cities.find(c => c.slug === 'coimbatore') ?? cities[0]
  let localities: Locality[] = []
  if (primaryCity) {
    try { localities = (await searchApi.localities(primaryCity.id)).data.slice(0, 8) } catch { localities = [] }
  }

  const services = [
    { icon: ShieldCheck,   title: 'Verified listings',  desc: 'Documents checked before the badge' },
    { icon: HandCoins,     title: 'Zero brokerage',     desc: 'Deal directly with owners' },
    { icon: CalendarCheck, title: 'Book site visits',   desc: 'Pick a slot, owner confirms' },
    { icon: Calculator,    title: 'EMI calculator',     desc: 'Plan your home loan upfront' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient rounded-b-3xl px-4 pt-16 pb-28 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Brand stays location-neutral; the launch city is a status line, not the identity */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-100 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
            Now live in {primaryCity?.name ?? 'Coimbatore'} — more cities soon
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Find your next home
          </h1>
          <div className="w-12 h-[3px] rounded bg-accent-400 mx-auto mb-4" />
          <p className="text-brand-100 text-lg mb-8">Verified listings, direct from owners — no brokerage.</p>
        </div>
        <div className="max-w-2xl mx-auto"><SearchBar /></div>
      </section>

      {/* Floating trust band */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="-mt-12 relative z-10 bg-white rounded-2xl shadow-card border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 py-6">
          <Stat value={`${totalListings.toLocaleString('en-IN')}${totalListings ? '+' : ''}`} label="Active listings" />
          <Stat value={`${localities.length || '—'}`} label="Localities covered" />
          <Stat value="0%" label="Brokerage" />
        </div>
      </div>

      {/* Browse by locality */}
      {localities.length > 0 && (
        <Section title="Browse by locality" subtitle={`Popular areas in ${primaryCity?.name ?? 'Coimbatore'}`}
          action={<Link href="/properties" className="text-sm font-medium text-brand-600 hover:underline">View all →</Link>}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {localities.map(loc => (
              <Link key={loc.id} href={`/properties?citySlug=${primaryCity?.slug}&localityId=${loc.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:border-brand-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <p className="font-medium text-slate-800 text-sm group-hover:text-brand-600 transition-colors">{loc.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{primaryCity?.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <Section surface="tint" title="Featured properties" subtitle="Hand-picked listings worth a look"
          action={<Link href="/properties?featuredOnly=true" className="text-sm font-medium text-brand-600 hover:underline">View all →</Link>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Section>
      )}

      {/* Why choose us */}
      <Section title="Why PropFind" subtitle="Built for owners and buyers — not brokers">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-accent-400" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-hero-gradient rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Own a property? List it for free</h2>
            <p className="text-brand-100 text-sm">Reach buyers and renters in your city. Get inquiries directly — no brokerage.</p>
          </div>
          <Link href="/post-property" className={buttonClasses('secondary', 'lg', 'text-brand-700')}>
            Post your property →
          </Link>
        </div>
      </section>
    </div>
  )
}
