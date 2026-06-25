'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { searchApi } from '@/lib/api'
import Select from '@/components/ui/Select'
import type { ListingType, City } from '@/types'

const TABS: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'SALE' }, { label: 'Rent', value: 'RENT' }, { label: 'PG / Co-living', value: 'PG' },
]

interface Props {
  compact?: boolean
  /** Pass current listingType in compact mode so search preserves the active tab (e.g. RENT) */
  currentListingType?: ListingType
}

export default function SearchBar({ compact = false, currentListingType }: Props) {
  const router = useRouter()
  const [tab,     setTab]     = useState<ListingType>('SALE')
  const [keyword, setKeyword] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [cities,  setCities]  = useState<City[]>([])

  // City list comes from the backend so the user picks a real, correctly-spelled
  // city slug — no free-text typos that silently return zero results (item 7).
  useEffect(() => { searchApi.cities().then(r => setCities(r.data)).catch(() => {}) }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ listingType: tab })
    if (citySlug) params.set('citySlug', citySlug)
    if (keyword)  params.set('keyword',  keyword)
    router.push(`/properties?${params.toString()}`)
  }

  function handleCompactSearch(e: React.FormEvent) {
    e.preventDefault()
    // Preserve the listingType passed from the parent (e.g. RENT) so searching
    // from the properties page doesn't silently reset to SALE.
    const params = new URLSearchParams({ listingType: currentListingType ?? 'SALE' })
    if (citySlug) params.set('citySlug', citySlug)
    if (keyword)  params.set('keyword',  keyword)
    router.push(`/properties?${params.toString()}`)
  }

  const cityOptions = cities.map(c => ({ value: c.slug, label: c.name }))

  if (compact) return (
    <form onSubmit={handleCompactSearch} className="w-full flex gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
      <div className="shrink-0 w-36">
        <Select value={citySlug} onChange={setCitySlug} options={cityOptions} placeholder="All cities" aria-label="City" />
      </div>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Locality, project or keyword…" className="flex-1 min-w-0 px-3 text-sm outline-none text-slate-700 placeholder-slate-400" />
      <button type="submit" className="shrink-0 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-brand-800 transition-colors"><Search size={15} />Search</button>
    </form>
  )

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-col sm:flex-row gap-2 shadow-card lg:mr-[10%]">
        <div className="flex-1 min-w-0 border border-slate-200 rounded-lg sm:border-0 sm:border-r sm:border-slate-200 sm:rounded-none">
          <Select value={citySlug} onChange={setCitySlug} options={cityOptions}
            placeholder="City (e.g. Coimbatore)" icon={<MapPin size={16} />} aria-label="City" bare
            className="px-3" />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 px-3 border border-slate-200 sm:border-0 rounded-lg sm:rounded-none">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Locality, project or keyword..."
            className="w-full py-2.5 text-sm outline-none text-slate-700 placeholder-slate-400" />
        </div>
        <button type="submit" className="shrink-0 bg-brand-600 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"><Search size={16} />Search</button>
      </form>
    </div>
  )
}
