import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: April 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">1. Information we collect</h2>
            <p>When you register or use PropFind, we collect information you provide directly — your name, email address, phone number, and any property details you submit. We also collect usage data such as pages viewed and search queries to improve the platform.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">2. How we use your information</h2>
            <ul className="space-y-2">
              <li>· To create and manage your account</li>
              <li>· To process and display property listings</li>
              <li>· To send you inquiry notifications and account-related emails</li>
              <li>· To improve our services and personalise your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">3. Sharing of information</h2>
            <p>We do not sell your personal data. Your contact information is shared with a property owner or agent only when you explicitly submit an inquiry. We may share data with service providers (email delivery, cloud storage) solely to operate the platform.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">4. Data retention</h2>
            <p>Your data is retained for as long as your account is active. You may request deletion of your account and associated data by contacting us at support@propfind.in.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">5. Cookies</h2>
            <p>PropFind uses essential cookies and localStorage for authentication (JWT tokens) and session persistence. No third-party advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">6. Security</h2>
            <p>We use industry-standard practices including HTTPS, hashed passwords, and JWT-based authentication. No system is perfectly secure — please use a strong, unique password for your account.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">7. Contact</h2>
            <p>For privacy-related requests, email us at <Link href="/contact" className="text-brand-600 hover:underline">support@propfind.in</Link> or visit our <Link href="/contact" className="text-brand-600 hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
