import { FlowPage } from '../components/FlowPage'
import { briefFlow } from '../forms/flows'

export default function Professionals() {
  return (
    <FlowPage
      kicker="For professionals"
      title="Share a project brief"
      intro={
        <>
          <p>For architects, interior designers, contractors, developers and hospitality projects. One brief can cover every collection a project needs, from sanitaryware and concealed cisterns to floor and wall finishes.</p>
          <p>Approximate scope is enough to start a conversation; specifications and quantities are confirmed with ABC.</p>
        </>
      }
      note="It shows how a project brief could reach ABC. Nothing is sent and no one will contact you. Please don’t include drawings or confidential client details."
      flow={briefFlow}
      referencePrefix="PRJ"
      restartLabel="Start a new brief"
      doneLinks={[{ label: 'Explore collections', to: '/collections' }]}
    />
  )
}
