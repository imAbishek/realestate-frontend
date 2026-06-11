import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ConditionalShell from '@/components/layout/ConditionalShell'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <ConditionalShell>{children}</ConditionalShell>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  )
}
