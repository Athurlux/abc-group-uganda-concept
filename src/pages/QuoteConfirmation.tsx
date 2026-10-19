import { Link, useParams } from 'react-router'
import { Icon } from '../components/Icon'
import { Summary } from '../forms/FormFlow'
import { useForms } from '../forms/FormsContext'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function QuoteConfirmation() {
  const { reference } = useParams()
  const { completions, setCompletion } = useForms()
  const completion = completions.quote?.reference === reference ? completions.quote : null
  useDocumentTitle(completion ? 'Demo quote request complete' : 'No quote request to show')

  if (!completion) {
    return (
      <section className="container confirmation">
        <h1>There’s no quote request to show here.</h1>
        <p className="lede">
          Demo summaries are held in memory only while you browse, so they disappear after a refresh or when this page is opened
          from a link. Nothing was ever sent, and no request exists for this reference.
        </p>
        <div className="button-row">
          <Link to="/shortlist" className="button button--primary">Open your shortlist</Link>
          <Link to="/collections" className="button button--outline">Continue exploring</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container confirmation" aria-labelledby="confirmation-title">
      <p className="kicker">Demo reference {completion.reference}</p>
      <h1 id="confirmation-title">Demo complete. No quote request was sent.</h1>
      <p className="notice">This summary exists only in this browser tab. ABC has not received it and will not contact you about it.</p>

      <section className="summary__section" aria-labelledby="confirmed-selections">
        <div className="summary__head"><h3 id="confirmed-selections">Selections ({completion.selections?.length ?? 0})</h3></div>
        <ul className="selection-summary">
          {completion.selections?.map(selection => (
            <li key={selection.id}><span>{selection.name}<small>{selection.collection}</small></span><span>{selection.quantity}</span></li>
          ))}
        </ul>
      </section>
      <Summary sections={completion.sections} />

      <div className="button-row no-print">
        <button type="button" className="button button--outline" onClick={() => window.print()}><Icon name="print" size={18} /> Print or save as PDF</button>
        <Link to="/collections" className="button button--primary">Continue exploring</Link>
        <Link to="/quote" className="text-button" onClick={() => setCompletion('quote', null)}>Start another demo request</Link>
      </div>
      <p className="fine-print">Your shortlist is still saved on this device. To contact ABC for real, use the details on the <Link to="/contact">contact page</Link>.</p>
    </section>
  )
}
