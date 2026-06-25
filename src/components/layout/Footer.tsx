import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

const SOCIALS: [string, typeof Facebook, string][] = [
  ['Facebook', Facebook, '#'],
  ['Instagram', Instagram, '#'],
  ['Twitter', Twitter, '#'],
  ['LinkedIn', Linkedin, '#'],
]

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-semibold text-lg mb-3">Prop<span className="text-accent-400">Find</span></div>
          <p className="text-sm leading-relaxed text-slate-400">A trusted platform to buy, rent, and list verified properties — owners and buyers, no middlemen. Now in Coimbatore, expanding city by city.</p>
          <div className="flex items-center gap-3 mt-5">
            {SOCIALS.map(([label, Icon, href]) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-3">Browse</p>
          <ul className="space-y-2 text-sm">
            {[['Buy property','/properties?listingType=SALE'],['Rent property','/properties?listingType=RENT'],['PG / Co-living','/properties?listingType=PG'],['Post your property','/post-property']].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            {[['All listings','/properties'],['Featured','/properties?featuredOnly=true'],['Verified only','/properties'],['Book a site visit','/properties']].map(([l,h]) => (
              <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            {[['About us','/about'],['Contact','/contact'],['Privacy policy','/privacy'],['Terms of use','/terms']].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PropFind. All rights reserved.
      </div>
    </footer>
  )
}
