// app/privacy/page.tsx 에 넣으세요

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020816] text-white px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extralight mb-2 text-[rgba(255,255,255,0.92)]">Privacy Policy</h1>
      <p className="text-[rgba(255,255,255,0.38)] text-sm mb-12">Last updated: May 2026</p>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">1. Overview</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          Moss ("we", "our", or "the app") is a personal habit tracking web application.
          We are committed to protecting your privacy. This policy explains what data we collect,
          how we use it, and your rights regarding that data.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">2. Data We Collect</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed mb-4">
          Moss stores your habit data (names, icons, counts, and daily logs) locally on your device
          using your browser's localStorage. This data never leaves your device unless you choose
          to export it manually.
        </p>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          We do not collect, store, or transmit any personally identifiable information to our servers.
          There are no user accounts, no login required, and no data sent to third-party services
          by Moss itself.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">3. Google AdSense</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed mb-4">
          Moss uses Google AdSense to display advertisements. Google AdSense may use cookies
          and similar technologies to serve ads based on your prior visits to this website or
          other websites on the internet.
        </p>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed mb-4">
          Google's use of advertising cookies enables it and its partners to serve ads based on
          your visit to Moss and/or other sites on the internet.
        </p>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          You may opt out of personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
            className="text-[#5acb8a] underline underline-offset-2">
            Google Ads Settings
          </a>
          . For more information about how Google uses data, please visit{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
            className="text-[#5acb8a] underline underline-offset-2">
            Google's Privacy Policy
          </a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">4. Cookies</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          Moss itself does not use cookies. However, Google AdSense and Vercel Analytics
          (used for anonymous traffic statistics) may place cookies on your device.
          These are governed by their respective privacy policies.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">5. Analytics</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          We use Vercel Analytics to collect anonymous, aggregated usage data such as
          page views and general geographic region. This data does not identify individual users
          and is used solely to understand how Moss is being used.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">6. Children's Privacy</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          Moss is not directed at children under the age of 13. We do not knowingly collect
          personal information from children.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">7. Changes to This Policy</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          We may update this Privacy Policy from time to time. Changes will be reflected by
          updating the "Last updated" date at the top of this page.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-lg font-light text-[rgba(255,255,255,0.8)] mb-3">8. Contact</h2>
        <p className="text-[rgba(255,255,255,0.55)] text-sm font-light leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at the
          email address associated with the Moss project.
        </p>
      </section>

      <div className="border-t border-[rgba(255,255,255,0.06)] pt-8 text-center">
        <a href="/" className="text-[#5acb8a] text-sm font-light">← Back to Moss</a>
      </div>
    </div>
  )
}
