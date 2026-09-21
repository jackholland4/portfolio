import Button from '@/components/ui/Button'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-[var(--c-txt-0)] text-4xl md:text-5xl mb-6">
          About
        </h1>
        <p className="font-body text-[var(--c-txt-1)] leading-relaxed mb-10">
          My name is Jack Holland. I'm an amateur photographer from Fairfield, Connecticut. I shoot on a Canon EOS Rebel.
          <code className="text-[var(--c-txt-0)]">app/about/page.tsx</code>.
        </p>
        <Button href="/contact" variant="primary">
          Get in touch →
        </Button>
      </div>
    </main>
  )
}
