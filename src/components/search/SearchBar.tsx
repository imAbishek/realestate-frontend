'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { searchApi } from '@/lib/api'
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

  const cityOptions = cities.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)

  if (compact) return (
    <form onSubmit={handleCompactSearch} className="w-full flex gap-2 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm">
      <select value={citySlug} onChange={e => setCitySlug(e.target.value)}
        className="shrink-0 w-32 px-2 text-sm outline-none text-slate-700 bg-white rounded-lg">
        <option value="">All cities</option>
        {cityOptions}
      </select>
      <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Locality, project or keyword…" className="flex-1 min-w-0 px-3 text-sm outline-none text-slate-700 placeholder-slate-400" />
      <button type="submit" className="shrink-0 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-brand-800 transition-colors"><Search size={15} />Search</button>
    </form>
  )

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === t.value ? 'bg-white text-brand-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="bg-white rounded-b-2xl rounded-tr-2xl p-2 flex flex-wrap sm:flex-nowrap gap-2 shadow-xl max-w-2xl">
        <select value={citySlug} onChange={e => setCitySlug(e.target.value)}
          className="w-full sm:w-40 px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-400 text-slate-700 bg-white">
          <option value="">Select city</option>
          {cityOptions}
        </select>
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Locality, project or keyword..." className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-400 text-slate-700 placeholder-slate-400" />
        <button type="submit" className="w-full sm:w-auto bg-accent-400 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><Search size={16} />Search</button>
      </form>
    </div>
  )
}
