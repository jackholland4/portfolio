import { redirect } from 'next/navigation'

// Contact info now lives on the About page — redirect rather than 404
// in case this URL is bookmarked or linked anywhere.
export default function ContactPage() {
  redirect('/about')
}
