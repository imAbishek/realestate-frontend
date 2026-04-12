import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ConditionalShell from '@/components/layout/ConditionalShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PropFind — Buy, Rent & Sell Properties in India',
  description: 'Find your perfect home. Search 1 lakh+ verified properties across India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <ConditionalShell>{children}</ConditionalShell>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  )
}
