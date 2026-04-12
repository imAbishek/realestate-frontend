import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Terms of Use</h1>
          <p className="text-gray-400 text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">1. Acceptance of terms</h2>
            <p>By accessing or using PropFind, you agree to these Terms of Use. If you do not agree, do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years old to create an account or post a listing. By registering, you confirm you meet this requirement.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">3. Listings and content</h2>
            <ul className="space-y-2">
              <li>· You are solely responsible for the accuracy of listings you post.</li>
              <li>· Listings must be for real properties you own or are authorised to advertise.</li>
              <li>· Fraudulent, misleading, or duplicate listings will be removed and may result in account suspension.</li>
              <li>· All listings are subject to review and approval by PropFind moderators.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">4. Prohibited conduct</h2>
            <ul className="space-y-2">
              <li>· Do not use the platform to harass, spam, or defraud other users.</li>
              <li>· Do not attempt to circumvent security controls or access others' accounts.</li>
              <li>· Do not scrape or bulk-download listing data without written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">5. Account suspension</h2>
            <p>PropFind reserves the right to suspend or terminate accounts that violate these terms, without prior notice. Banned users may not create new accounts.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">6. Disclaimer</h2>
            <p>PropFind is a platform — we do not own, inspect, or guarantee any listed property. All transactions are between the buyer/renter and the seller/landlord. Perform your own due diligence before any property decision.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">7. Governing law</h2>
            <p>These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">8. Changes to terms</h2>
            <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-gray-400">Questions? <Link href="/contact" className="text-brand-600 hover:underline">Contact us</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
