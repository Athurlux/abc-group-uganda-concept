import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { FlowPage } from '../components/FlowPage'
import { findShowroom } from '../data/locations'
import { useForms } from '../forms/FormsContext'
import { visitFlow, type VisitDraft } from '../forms/flows'
import { shortlist, useShortlist, withItems } from '../lib/shortlist'

export default function Visit() {
  const state = useShortlist()
  const [params] = useSearchParams()
  const { drafts, setDraft } = useForms()
  const draft = drafts[visitFlow.key] as VisitDraft | undefined
  const preferred = findShowroom(params.get('showroom'))?.slug ?? state.showroom

  // A showroom chosen elsewhere carries in; one chosen here becomes the preference.
  useEffect(() => {
    if (preferred && !draft?.showroom) setDraft(visitFlow.key, { ...(draft ?? visitFlow.empty()), showroom: preferred })
  }, [preferred, draft, setDraft])
  useEffect(() => {
    if (draft?.showroom && draft.showroom !== state.showroom) shortlist.setShowroom(draft.showroom)
  }, [draft?.showroom, state.showroom])

  return (
    <FlowPage
      kicker="Showrooms"
      title="Plan a showroom visit"
      intro={<p>Choose a showroom, a preferred day and a rough time, then review. Opening hours are not published, so these are preferences, not appointments.</p>}
      note="It shows how a visit request could work. No appointment is booked, no calendar is checked and the showroom is not told."
      flow={visitFlow}
      referencePrefix="VIS"
      restartLabel="Plan another visit"
      doneLinks={[{ label: 'Back to showrooms', to: '/showrooms' }]}
      extra={values => {
        const rows = values.bringShortlist === 'yes' ? withItems(shortlist.snapshot()) : []
        return { meta: rows.length ? [{ label: 'Shortlist included', value: rows.map(({ item }) => item.name).join(', ') }] : [] }
      }}
    />
  )
}
