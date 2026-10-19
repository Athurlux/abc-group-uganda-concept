import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FlowPage } from '../components/FlowPage'
import { EmptyShortlist, ShortlistList } from '../components/ShortlistControls'
import { COLLECTIONS } from '../data/collections'
import { findShowroom } from '../data/locations'
import { useForms } from '../forms/FormsContext'
import { quoteFlow, type QuoteDraft } from '../forms/flows'
import { DONE } from '../forms/useFormFlow'
import { quantityLabel, shortlist, useShortlist, withItems } from '../lib/shortlist'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Quote() {
  const state = useShortlist()
  const [params] = useSearchParams()
  const { drafts, setDraft } = useForms()
  const draft = drafts[quoteFlow.key] as QuoteDraft | undefined
  const preferred = findShowroom(params.get('showroom'))?.slug ?? state.showroom

  // The preferred showroom (from a showroom page or the shortlist) carries into the
  // form, without overwriting a choice already made here.
  useEffect(() => {
    if (preferred && !draft?.showroom) setDraft(quoteFlow.key, { ...(draft ?? quoteFlow.empty()), showroom: preferred })
  }, [preferred, draft, setDraft])

  // And a showroom chosen here becomes the preference elsewhere.
  useEffect(() => {
    if (draft?.showroom && draft.showroom !== 'none' && draft.showroom !== state.showroom) shortlist.setShowroom(draft.showroom)
  }, [draft?.showroom, state.showroom])

  useDocumentTitle('Request a quote')
  if (!state.items.length && params.get('step') !== DONE) {
    return (
      <section className="container section">
        <h1>Request a quote</h1>
        <p className="lede">A quote request starts from your project shortlist, and it is empty at the moment.</p>
        <EmptyShortlist />
        <p className="fine-print">Planning something larger? <Link to="/professionals">Share a project brief</Link> instead.</p>
      </section>
    )
  }

  return (
    <FlowPage
      kicker="Plan your project"
      title="Request a quote"
      intro={<p>Four short steps: check your selections, describe the project, choose how to be contacted, then review.</p>}
      note="It shows how a quote request could work. Nothing is sent, ABC is not contacted and no quote is prepared. Refreshing clears your answers; your shortlist stays."
      flow={quoteFlow}
      referencePrefix="ABC"
      doneRoute={reference => `/quote/confirmation/${reference}`}
      stageLead={(_draft, stageId) => stageId === 'selections' ? <div className="flow__selections"><ShortlistList /></div> : null}
      reviewLead={<ReviewSelections />}
      extra={() => {
        const rows = withItems(shortlist.snapshot())
        return {
          selections: rows.map(({ entry, item }) => ({
            id: item.id, name: item.name, quantity: quantityLabel(entry),
            collection: COLLECTIONS.find(collection => collection.slug === item.collection)?.name ?? '',
          })),
          meta: [{ label: 'Selections', value: `${rows.length} from your shortlist` }],
        }
      }}
    />
  )
}

function ReviewSelections() {
  const rows = withItems(useShortlist())
  return (
    <section className="summary__section" aria-labelledby="review-selections">
      <div className="summary__head"><h3 id="review-selections">Selections</h3><Link to="?step=selections" className="text-button">Edit<span className="visually-hidden"> selections</span></Link></div>
      <ul className="selection-summary">
        {rows.map(({ entry, item }) => <li key={item.id}><span>{item.name}</span><span>{quantityLabel(entry)}</span></li>)}
      </ul>
    </section>
  )
}
