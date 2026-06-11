import Link from 'next/link'
import type { ReactNode } from 'react'

/** Shared branded backdrop for /auth/* — gradient band the page card overlaps,
 *  mirroring the homepage hero + floating trust-band pattern. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient rounded-b-3xl px-4 pt-14 pb-28 text-center">
        <Link href="/" className="inline-flex items-baseline">
          <span className="text-3xl font-semibold text-white">Prop</span>
          <span className="text-3xl font-semibold text-accent-400">Find</span>
        </Link>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-accent-400" />
      </div>
      <div className="relative -mt-20 flex justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
