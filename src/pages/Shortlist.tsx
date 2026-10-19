import { Link } from 'react-router'
import { PageIntro } from '../components/PageIntro'
import { ClearShortlist, EmptyShortlist, ShortlistList } from '../components/ShortlistControls'
import { findShowroom } from '../data/locations'
import { useShortlist } from '../lib/shortlist'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Shortlist() {
  useDocumentTitle('Project shortlist')
  const state = useShortlist()
  const count = state.items.length
  const showroom = findShowroom(state.showroom)

  return (
    <>
      <PageIntro kicker="Plan your project" title="Project shortlist">
        <p>Your saved selections, kept on this device between visits. It is a planning list, not a basket: there are no prices and nothing is ordered.</p>
      </PageIntro>
      <section className="container section section--tight shortlist-page" aria-labelledby="list-title">
        <h2 className="visually-hidden" id="list-title">Saved selections</h2>
        {count ? (
          <div className="shortlist-page__grid">
            <div>
              <div className="shortlist-page__bar">
                <p className="results-count"><strong>{count}</strong> {count === 1 ? 'selection' : 'selections'}</p>
                <ClearShortlist />
              </div>
              <ShortlistList />
              <p className="fine-print">Only item IDs, piece counts and your preferred showroom are saved on this device. Nothing is sent anywhere.</p>
            </div>
            <aside className="shortlist-page__next" aria-label="Next steps">
              <h2>Next step</h2>
              <p>Describe your project once and include every selection in a single demo quote request.</p>
              {showroom && <p className="fine-print">Preferred showroom: <strong>{showroom.name}</strong></p>}
              <Link to="/quote" className="button button--primary button--block">Request a quote</Link>
              <Link to="/showrooms/visit" className="button button--outline button--block">Plan a showroom visit</Link>
              <Link to="/collections" className="text-link">Continue exploring</Link>
            </aside>
          </div>
        ) : (
          <>
            <ClearShortlist />
            <EmptyShortlist />
          </>
        )}
      </section>
    </>
  )
}
