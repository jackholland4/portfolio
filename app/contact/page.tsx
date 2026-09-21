import { siteConfig } from '@/lib/site-config'
import EmailGate from '@/components/contact/EmailGate'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-[var(--c-txt-0)] text-4xl md:text-5xl mb-6">
          Contact
        </h1>
        {siteConfig.contactEmail ? (
          <EmailGate
            encodedEmail={Buffer.from(siteConfig.contactEmail).toString('base64')}
          />
        ) : (
          <p className="font-body text-[var(--c-txt-1)] leading-relaxed">
            Set <code className="text-[var(--c-txt-0)]">contactEmail</code> in{' '}
            <code className="text-[var(--c-txt-0)]">lib/site-config.ts</code> to show a
            contact address here.
          </p>
        )}
      </div>
    </main>
  )
}
