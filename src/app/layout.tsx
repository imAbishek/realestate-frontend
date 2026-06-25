import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ConditionalShell from '@/components/layout/ConditionalShell'

// Match the mobile Phase H aesthetic (mobile uses Plus Jakarta Sans).
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://realestate-frontend-ten-lyart.vercel.app'),
  title: {
    default: 'PropFind — Buy, Rent & Sell Properties',
    template: '%s | PropFind',
  },
  description: 'Verified listings, direct from owners — zero brokerage. Now live in Coimbatore, expanding city by city.',
  openGraph: {
    siteName: 'PropFind',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans bg-slate-50 text-slate-900`}>
        <ConditionalShell>{children}</ConditionalShell>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  )
}
