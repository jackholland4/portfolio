import Image from 'next/image'
import EmailGate from '@/components/contact/EmailGate'
import { siteConfig } from '@/lib/site-config'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-8 sm:items-start mb-12">
          <Image
            src="/about/portrait.jpg"
            alt={siteConfig.name}
            width={1581}
            height={1619}
            priority
            className="w-40 sm:w-48 h-auto flex-shrink-0"
          />
          <div>
            <h1 className="font-display font-bold text-[var(--c-txt-0)] text-4xl md:text-5xl mb-6">
              About
            </h1>
            <p className="font-body text-[var(--c-txt-1)] leading-relaxed">
              Amateur photographer from Fairfield, Connecticut. I shoot on a Canon EOS Rebel.
            </p>
          </div>
        </div>

        <h2 className="font-display font-semibold text-[var(--c-txt-0)] text-sm uppercase tracking-[0.15em] mb-4">
          Contact
        </h2>
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
