import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { FlowPage } from '../components/FlowPage'
import { findItem } from '../data/catalogue'
import { LOCATIONS } from '../data/locations'
import { CHECKED_ON, COMPANY_EMAIL, SOURCES } from '../data/site'
import { useForms } from '../forms/FormsContext'
import { contactFlow, type ContactDraft } from '../forms/flows'

export default function Contact() {
  const [params] = useSearchParams()
  const { drafts, setDraft } = useForms()
  const draft = drafts[contactFlow.key] as ContactDraft | undefined
  const item = findItem(params.get('item'))

  // "Request product details" arrives with the item, so the message starts written.
  useEffect(() => {
    if (item && !draft?.message) {
      setDraft(contactFlow.key, { ...(draft ?? contactFlow.empty()), category: 'products', message: `Please could you share the brand, size, finish and availability for: ${item.name}.` })
    }
  }, [item, draft, setDraft])

  return (
    <FlowPage
      kicker="Contact"
      title="Get in touch"
      intro={<p>Use the demo form to see how an enquiry could work, or contact ABC directly with the published details below.</p>}
      note="This form is not connected to email, WhatsApp or any server. To reach ABC, use the published details on this page."
      flow={contactFlow}
      referencePrefix="MSG"
      restartLabel="Write another message"
      doneLinks={[{ label: 'Continue exploring', to: '/collections' }]}
      beforeForm={
        <section className="real-contact" aria-labelledby="real-contact-title">
          <h2 id="real-contact-title">Contact ABC directly</h2>
          <p className="fine-print">Published on <a href={SOURCES.about} rel="noopener">ABC’s website</a>, checked {CHECKED_ON}. Not connected to this concept.</p>
          <p><a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></p>
          <ul className="phone-table">
            {LOCATIONS.map(location => <li key={location.slug}><span>{location.name}</span><a href={`tel:${location.phone}`}>{location.phoneDisplay}</a></li>)}
          </ul>
        </section>
      }
    />
  )
}
