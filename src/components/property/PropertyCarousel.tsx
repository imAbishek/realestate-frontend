'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PropertyCard as PropertyCardType } from '@/types'
import PropertyCard from '@/components/property/PropertyCard'

/** Horizontal, arrow-navigable carousel of property cards (no external dep). */
export default function PropertyCarousel({ properties }: { properties: PropertyCardType[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    // Scroll by roughly one card (first child width + gap), fallback to 80% viewport.
    const card = el.firstElementChild as HTMLElement | null
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => scroll(-1)} aria-label="Previous"
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-card text-slate-600 hover:text-brand-600 transition-colors">
        <ChevronLeft size={20} />
      </button>

      <div ref={trackRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {properties.map(p => (
          <div key={p.id} className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
            <PropertyCard property={p} />
          </div>
        ))}
      </div>

      <button type="button" onClick={() => scroll(1)} aria-label="Next"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-card text-slate-600 hover:text-brand-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
