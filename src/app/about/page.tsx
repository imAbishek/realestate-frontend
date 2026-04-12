import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">About PropFind</h1>
          <p className="text-gray-500">India's trusted real estate platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Who we are</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              PropFind is a real estate marketplace connecting buyers, sellers, and agents across India.
              We make it easy to discover, list, and inquire about residential and commercial properties —
              whether you're buying, renting, or looking for PG accommodation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">What we offer</h2>
            <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
              <li className="flex gap-2"><span className="text-brand-600 font-bold">·</span> Thousands of verified listings across major Indian cities</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">·</span> Direct contact with sellers and agents — no middlemen</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">·</span> Free listing for individual property owners</li>
              <li className="flex gap-2"><span className="text-brand-600 font-bold">·</span> Advanced filters for price, property type, furnishing, and more</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Our mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To make real estate search transparent, accessible, and efficient for every Indian —
              from a first-time buyer in Chennai to a landlord listing in Mumbai.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Questions?{' '}
              <Link href="/contact" className="text-brand-600 hover:underline">Get in touch with us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
