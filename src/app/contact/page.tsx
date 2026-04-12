export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact us</h1>
          <p className="text-gray-500">We'd love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Email</h2>
              <p className="text-sm text-gray-600">support@propfind.in</p>
              <p className="text-xs text-gray-400 mt-1">We reply within 1 business day</p>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone</h2>
              <p className="text-sm text-gray-600">+91 98765 43210</p>
              <p className="text-xs text-gray-400 mt-1">Mon–Sat, 9 AM – 6 PM IST</p>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Office</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                PropFind Technologies Pvt. Ltd.<br />
                123 Anna Salai, Thousand Lights<br />
                Chennai, Tamil Nadu 600002
              </p>
            </section>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Send a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" placeholder="Your name"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" placeholder="you@example.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea rows={4} placeholder="How can we help?"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-brand-600 hover:bg-brand-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
