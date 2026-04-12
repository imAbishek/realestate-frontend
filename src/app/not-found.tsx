import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-brand-600 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors">
          Go home
        </Link>
      </div>
    </div>
  )
}
