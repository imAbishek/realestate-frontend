import Link from 'next/link'
import { Sparkles, ShieldCheck, HandCoins, CalendarCheck, Calculator, Clock, Building2, MapPin, Home, Tag } from 'lucide-react'
import { propertyApi, searchApi } from '@/lib/api'
import SearchBar from '@/components/search/SearchBar'
import FeaturedHeroCarousel from '@/components/property/FeaturedHeroCarousel'
import PropertyCarousel from '@/components/property/PropertyCarousel'
import Section from '@/components/ui/Section'
import Stat from '@/components/ui/Stat'
import type { PropertyCard as PropertyCardType, City, Locality, Page } from '@/types'

// ISR: re-render at most every 5 minutes. Without this the page is statically baked
// ONCE at build time — and the Render free-tier backend sleeps after 15 idle minutes,
// so build-time fetches time out and the page ships permanently with 0 listings,
// "—" localities, and no Featured/Browse sections.
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
    try { localities = (await searchApi.localities(primaryCity.id)).data } catch { localities = [] }
  }

  const services = [
    { icon: ShieldCheck,   title: 'Verified listings',  desc: 'Documents checked before the badge' },
    { icon: HandCoins,     title: 'Zero brokerage',     desc: 'Deal directly with owners' },
    { icon: CalendarCheck, title: 'Book site visits',   desc: 'Pick a slot, owner confirms' },
    { icon: Calculator,    title: 'EMI calculator',     desc: 'Plan your home loan upfront' },
  ]

  const trust = [
    { icon: ShieldCheck, title: 'Verified listings', desc: 'Documents checked' },
    { icon: HandCoins,   title: 'Direct from owners', desc: 'Zero brokerage' },
    { icon: Clock,       title: 'Save time & money', desc: 'Smart tools for you' },
  ]

  return (
    <div>
      {/* Hero — two columns */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 grid lg:grid-cols-[6fr_4fr] gap-10 lg:gap-12 items-center">
          {/* Left: copy + search */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-3 py-1.5 mb-6">
              <Sparkles size={13} className="text-brand-600" />
              New in {primaryCity?.name ?? 'Coimbatore'} — more cities coming soon
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
              Find your<br />next <span className="italic text-brand-600">home</span><span className="text-accent-400">.</span>
            </h1>
            <p className="text-lg text-slate-600 mt-5 mb-8 max-w-md">
              Verified listings, direct from owners — <span className="text-brand-600 font-medium">no brokerage</span>.
            </p>

            <SearchBar />

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-7">
              {trust.map(t => (
                <div key={t.title} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <t.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: featured property showcase — auto-rotates through all featured */}
          {featured.length > 0 && <FeaturedHeroCarousel properties={featured} />}
        </div>
      </section>

      {/* Stats band */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="-mt-2 mb-4 relative z-10 bg-white rounded-2xl shadow-card border border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 py-7">
          <Stat icon={Building2} value={`${cities.length || '—'}${cities.length ? '+' : ''}`} label="Cities" />
          <Stat icon={MapPin}    value={`${localities.length || '—'}`} label="Localities" />
          <Stat icon={Home}      value={`${totalListings.toLocaleString('en-IN')}${totalListings ? '+' : ''}`} label="Properties" />
          <Stat icon={Tag}       value="₹0" label="Brokerage" />
        </div>
      </div>

      {/* Browse properties */}
      {featured.length > 0 && (
        <Section title="Browse properties" subtitle="Hand-picked listings from owners"
          action={<Link href="/properties" className="text-sm font-medium text-brand-600 hover:underline">View all properties →</Link>}>
          <PropertyCarousel properties={featured} />
        </Section>
      )}

      {/* Why PropFind */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Why PropFind?</h2>
          <p className="text-sm text-slate-500 mt-1">Built for owners and buyers — not brokers</p>
          <div className="w-10 h-[3px] rounded bg-accent-400 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => (
            <div key={s.title} className="flex items-start gap-3 bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="relative overflow-hidden bg-hero-gradient rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Decorative building line-art */}
          <svg aria-hidden viewBox="0 0 200 120" className="pointer-events-none absolute right-6 bottom-0 h-28 w-auto text-white/15" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="10" y="50" width="40" height="70" />
            <rect x="60" y="25" width="45" height="95" />
            <rect x="115" y="60" width="35" height="60" />
            <rect x="158" y="40" width="32" height="80" />
            <path d="M18 60h8M34 60h8M18 74h8M34 74h8M18 88h8M34 88h8M70 38h10M90 38h6M70 56h10M90 56h6M70 74h10M90 74h6M124 72h6M138 72h6M124 90h6M138 90h6M166 54h6M180 54h4M166 72h6M180 72h4" />
          </svg>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">Own a property? List it for free</h2>
            <p className="text-brand-100 text-sm max-w-md">Reach buyers and renters in your city. Get inquiries directly — no brokerage.</p>
          </div>
          <Link href="/post-property" className="relative shrink-0 inline-flex items-center gap-2 bg-white text-brand-700 font-medium text-sm px-7 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            Post your property →
          </Link>
        </div>
      </section>
    </div>
  )
}
