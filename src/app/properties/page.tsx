'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { propertyApi } from '@/lib/api'
import PropertyCard from '@/components/property/PropertyCard'
import SearchBar from '@/components/search/SearchBar'
import type { PropertyCard as PropertyCardType, ListingType, PropertyType, FurnishingStatus, Page } from '@/types'

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Apartment',         value: 'APARTMENT'         },
  { label: 'Independent house', value: 'INDEPENDENT_HOUSE' },
  { label: 'Villa',             value: 'VILLA'             },
  { label: 'Plot',              value: 'PLOT'              },
  { label: 'Builder floor',     value: 'BUILDER_FLOOR'     },
]

// ── Filter panel extracted to a stable component outside the page ──────────
// Defining components inside a parent causes unmount/remount on every render.
interface FilterPanelProps {
  listingType: ListingType
  selectedBhk: number[]
  selectedType: PropertyType | ''
  furnishing: FurnishingStatus | ''
  minPrice: string
  maxPrice: string
  onListingType: (t: ListingType) => void
  onBhk: (b: number) => void
  onPropertyType: (t: PropertyType | '') => void
  onFurnishing: (f: FurnishingStatus) => void
  onMinPrice: (v: string) => void
  onMaxPrice: (v: string) => void
  onApply: () => void
  onClear: () => void
}

function FilterPanel({
  listingType, selectedBhk, selectedType, furnishing, minPrice, maxPrice,
  onListingType, onBhk, onPropertyType, onFurnishing, onMinPrice, onMaxPrice,
  onApply, onClear,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      {/* Listing type */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Listing type</p>
        {(['SALE','RENT','PG'] as ListingType[]).map(t => (
          <label key={t} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="lt" checked={listingType === t}
              onChange={() => onListingType(t)} className="accent-brand-600" />
            <span className="text-sm text-gray-600">{t === 'SALE' ? 'Buy' : t === 'RENT' ? 'Rent' : 'PG / Co-living'}</span>
          </label>
        ))}
      </div>

      {/* BHK */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">BHK type</p>
        <div className="flex flex-wrap gap-2">
          {[1,2,3,4].map(b => (
            <button key={b} onClick={() => onBhk(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${selectedBhk.includes(b) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
              {b === 4 ? '4+ BHK' : `${b} BHK`}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Budget</p>
        <div className="space-y-2">
          <input type="number" min="0" value={minPrice} onChange={e => onMinPrice(e.target.value)} placeholder="Min ₹"
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
          <input type="number" min="0" value={maxPrice} onChange={e => onMaxPrice(e.target.value)} placeholder="Max ₹"
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-brand-400" />
        </div>
      </div>

      {/* Property type */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Property type</p>
        {PROPERTY_TYPES.map(pt => (
          <label key={pt.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="propType" checked={selectedType === pt.value}
              onChange={() => onPropertyType(selectedType === pt.value ? '' : pt.value)}
              className="accent-brand-600" />
            <span className="text-sm text-gray-600">{pt.label}</span>
          </label>
        ))}
      </div>

      {/* Furnishing */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Furnishing</p>
        {(['UNFURNISHED','SEMI_FURNISHED','FULLY_FURNISHED'] as FurnishingStatus[]).map(f => (
          <label key={f} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="furn" checked={furnishing === f} onChange={() => onFurnishing(f)} className="accent-brand-600" />
            <span className="text-sm text-gray-600">
              {f === 'UNFURNISHED' ? 'Unfurnished' : f === 'SEMI_FURNISHED' ? 'Semi-furnished' : 'Fully furnished'}
            </span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onApply}
          className="flex-1 bg-brand-600 text-white text-sm py-2 rounded-lg hover:bg-brand-800 transition-colors">
          Apply filters
        </button>
        <button onClick={onClear}
          className="px-4 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">
          Clear
        </button>
      </div>
    </div>
  )
}

// ── Main page content — separated so Suspense can wrap useSearchParams() ──
function PropertiesContent() {
  const searchParams = useSearchParams()

  const [listingType,   setListingType]   = useState<ListingType>((searchParams.get('listingType') as ListingType) || 'SALE')
  const [selectedType,  setSelectedType]  = useState<PropertyType | ''>('')
  const [selectedBhk,   setSelectedBhk]   = useState<number[]>([])
  const [furnishing,    setFurnishing]    = useState<FurnishingStatus | ''>('')
  const [minPrice,      setMinPrice]      = useState(searchParams.get('minPrice') || '')
  const [maxPrice,      setMaxPrice]      = useState(searchParams.get('maxPrice') || '')
  const [citySlug,      setCitySlug]      = useState(searchParams.get('citySlug') || '')
  const [keyword,       setKeyword]       = useState(searchParams.get('keyword') || '')
  const [sort,          setSort]          = useState('createdAt,desc')
  const [page,          setPage]          = useState(0)
  const [results,       setResults]       = useState<Page<PropertyCardType> | null>(null)
  const [loading,       setLoading]       = useState(false)

  // Sync state when URL search params change (e.g. Navbar Buy/Rent/PG links)
  useEffect(() => {
    const lt = (searchParams.get('listingType') as ListingType) || 'SALE'
    const cs = searchParams.get('citySlug') || ''
    const kw = searchParams.get('keyword')  || ''
    setListingType(lt)
    setCitySlug(cs)
    setKeyword(kw)
    setPage(0)
  }, [searchParams])

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = { listingType, sort, page, size: 12 }
      if (citySlug)           params.citySlug    = citySlug
      if (keyword)            params.keyword     = keyword
      if (minPrice)           params.minPrice    = minPrice
      if (maxPrice)           params.maxPrice    = maxPrice
      if (furnishing)         params.furnishing  = furnishing
      if (selectedBhk.length) {
        params.minBedrooms = Math.min(...selectedBhk)
        // Only cap with maxBedrooms when "4+ BHK" is NOT selected (4 means "4 or more")
        if (!selectedBhk.includes(4)) params.maxBedrooms = Math.max(...selectedBhk)
      }
      if (selectedType)       params.propertyType = selectedType
      const { data } = await propertyApi.search(params as never)
      setResults(data)
    } catch {
      // Search errors are non-fatal; the empty state UI handles it
    } finally {
      setLoading(false)
    }
  }, [listingType, sort, page, citySlug, keyword, minPrice, maxPrice, furnishing, selectedBhk, selectedType])

  useEffect(() => { fetchResults() }, [fetchResults])

  const activeFilters = [
    ...(citySlug   ? [{ label: citySlug,   clear: () => { setCitySlug('');    setPage(0) } }] : []),
    ...(keyword    ? [{ label: keyword,    clear: () => { setKeyword('');     setPage(0) } }] : []),
    ...(furnishing   ? [{ label: furnishing.replace(/_/g,' '), clear: () => { setFurnishing('');  setPage(0) } }] : []),
    ...(selectedType ? [{ label: selectedType.replace(/_/g,' ').toLowerCase(), clear: () => { setSelectedType(''); setPage(0) } }] : []),
    ...selectedBhk.map(b => ({ label: `${b} BHK`, clear: () => { setSelectedBhk(p => p.filter(v => v !== b)); setPage(0) } })),
  ]

  function handleListingType(t: ListingType) { setListingType(t); setPage(0) }
  function handleBhk(b: number) { setSelectedBhk(p => p.includes(b) ? p.filter(v => v !== b) : [...p, b]); setPage(0) }
  // Fix: clear also resets the page so stale pagination is never shown
  function handleClear() { setSelectedBhk([]); setSelectedType(''); setFurnishing(''); setMinPrice(''); setMaxPrice(''); setPage(0) }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top search bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-3 items-center">
          <div className="flex-1 max-w-xl"><SearchBar compact /></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Result count + chips + sort */}
        <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">
              {results ? `${results.totalElements.toLocaleString()} properties found` : 'Searching...'}
            </span>
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 border border-brand-200 rounded-full px-3 py-0.5 text-xs font-medium">
                {f.label}<button onClick={f.clear}><X size={10} /></button>
              </span>
            ))}
          </div>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(0) }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none">
            <option value="createdAt,desc">Newest first</option>
            <option value="price,asc">Price: Low to high</option>
            <option value="price,desc">Price: High to low</option>
            <option value="viewsCount,desc">Most popular</option>
          </select>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 shrink-0 bg-white border-r border-gray-100 p-4 min-h-screen">
            <FilterPanel
              listingType={listingType}
              selectedBhk={selectedBhk}
              selectedType={selectedType}
              furnishing={furnishing}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onListingType={handleListingType}
              onBhk={handleBhk}
              onPropertyType={t => { setSelectedType(t); setPage(0) }}
              onFurnishing={f => { setFurnishing(f); setPage(0) }}
              onMinPrice={setMinPrice}
              onMaxPrice={setMaxPrice}
              onApply={fetchResults}
              onClear={handleClear}
            />
          </aside>

          {/* Grid */}
          <main className="flex-1 p-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
                ))}
              </div>
            ) : results?.content.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-2">No properties found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results?.content.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}

            {/* Pagination */}
            {results && results.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={results.first} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50">
                  ← Prev
                </button>
                {(() => {
                  const windowSize = 7
                  const half = Math.floor(windowSize / 2)
                  const start = Math.max(0, Math.min(page - half, results.totalPages - windowSize))
                  const end   = Math.min(results.totalPages, start + windowSize)
                  return Array.from({ length: end - start }, (_, i) => start + i).map(i => (
                    <button key={i} onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i ? 'bg-brand-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))
                })()}
                <button disabled={results.last} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50">
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// ── Exported page — wraps content in Suspense required by useSearchParams() ─
export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading properties...</div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}
