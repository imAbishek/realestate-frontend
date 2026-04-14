'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { ListingType } from '@/types'

const TABS: { label: string; value: ListingType }[] = [
  { label: 'Buy', value: 'SALE' }, { label: 'Rent', value: 'RENT' }, { label: 'PG / Co-living', value: 'PG' },
]

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [tab,     setTab]     = useState<ListingType>('SALE')
  const [keyword, setKeyword] = useState('')
  const [city,    setCity]    = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ listingType: tab })
    if (city)    params.set('citySlug', city.toLowerCase().replace(/\s+/g, '-'))
    if (keyword) params.set('keyword',  keyword)
    router.push(`/properties?${params.toString()}`)
  }

  if (compact) return (
    <form onSubmit={handleSearch} className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
      <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search city, locality, project..." className="flex-1 px-3 text-sm outline-none text-gray-700 placeholder-gray-400" />
      <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-brand-800 transition-colors"><Search size={15} />Search</button>
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
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="City (e.g. Coimbatore)" className="w-full sm:w-36 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-400 text-gray-700 placeholder-gray-400" />
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Locality, project or keyword..." className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-400 text-gray-700 placeholder-gray-400" />
        <button type="submit" className="w-full sm:w-auto bg-accent-400 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><Search size={16} />Search</button>
      </form>
    </div>
  )
}
