import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { Icon } from '../components/Icon'
import { ItemImg } from '../components/Img'
import { PageIntro } from '../components/PageIntro'
import { ItemCard } from '../components/ItemCard'
import { CATALOGUE, KIND_LABELS, type ItemKind } from '../data/catalogue'
import { COLLECTIONS } from '../data/collections'
import { activeChips, filterCatalogue, filtersToParams, parseFilters, type CatalogueFilters, type Sort } from '../lib/catalogueFilters'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Collections() {
  useDocumentTitle('Collections')
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  const [params, setParams] = useSearchParams()
  const filters = parseFilters(params)
  const results = filterCatalogue(filters)
  const chips = activeChips(filters)

  // Typing replaces the history entry; choosing a filter adds one, so Back undoes it.
  const apply = (patch: Partial<CatalogueFilters>, replace = false) => setParams(filtersToParams({ ...filters, ...patch }), { replace, preventScrollReset: true })
  const reset = () => setParams(filtersToParams({ ...filters, q: '', collection: null, kind: null }), { preventScrollReset: true })

  return (
    <div ref={root}>
      <PageIntro kicker="Collections" title="Materials for every room">
        <p>Browse ABC’s six collections, or search every item pictured on its website. Save anything useful to your project shortlist.</p>
      </PageIntro>

      <section className="container section section--tight" aria-labelledby="directory-title">
        <h2 className="visually-hidden" id="directory-title">Collections</h2>
        <ul className="collection-index">
          {COLLECTIONS.map(collection => {
            const cover = CATALOGUE.find(item => item.id === collection.cover)!
            return (
              <li key={collection.slug} data-anim="card">
                <Link to={`/collections/${collection.slug}`} className="collection-index__link">
                  <span className="collection-index__image"><ItemImg item={cover} alt="" sizes="96px" /></span>
                  <span>
                    <span className="collection-index__name">{collection.name}</span>
                    <span className="collection-index__short">{collection.short}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="container section section--tight catalogue" aria-labelledby="catalogue-title" id="catalogue">
        <div className="catalogue__head">
          <h2 className="section-title" id="catalogue-title">Every pictured selection</h2>
          <p className="fine-print">Images published on ABC’s website. Brand, size and price are to be confirmed for every item.</p>
        </div>

        <form className="filters" role="search" onSubmit={event => event.preventDefault()}>
          <div className="field filters__search">
            <label className="field__label" htmlFor="catalogue-q">Search</label>
            <span className="input-icon">
              <Icon name="search" size={18} />
              <input id="catalogue-q" className="input" type="search" value={filters.q} placeholder="For example, basin or sink" onChange={event => apply({ q: event.target.value }, true)} />
            </span>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="catalogue-collection">Collection</label>
            <select id="catalogue-collection" className="input input--select" value={filters.collection ?? ''} onChange={event => apply({ collection: event.target.value || null })}>
              <option value="">All collections</option>
              {COLLECTIONS.map(collection => <option key={collection.slug} value={collection.slug}>{collection.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="catalogue-type">Image type</label>
            <select id="catalogue-type" className="input input--select" value={filters.kind ?? ''} onChange={event => apply({ kind: (event.target.value || null) as ItemKind | null })}>
              <option value="">All types</option>
              {(Object.keys(KIND_LABELS) as ItemKind[]).map(kind => <option key={kind} value={kind}>{KIND_LABELS[kind]}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="catalogue-sort">Sort</label>
            <select id="catalogue-sort" className="input input--select" value={filters.sort} onChange={event => apply({ sort: event.target.value as Sort })}>
              <option value="collection">By collection</option>
              <option value="name">Name, A to Z</option>
            </select>
          </div>
        </form>

        <div className="results-bar">
          <p className="results-count" id="results-count" aria-live="polite"><strong>{results.length}</strong> of {CATALOGUE.length} selections</p>
          {chips.length > 0 && (
            <ul className="chips" aria-label="Active filters">
              {chips.map(chip => (
                <li key={chip.key}>
                  <button type="button" className="chip" onClick={() => apply({ [chip.key]: chip.key === 'q' ? '' : null })} aria-label={`${chip.label}: remove filter`}>
                    {chip.label} <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
              <li><button type="button" className="text-button" onClick={reset}>Reset all</button></li>
            </ul>
          )}
        </div>

        {results.length ? (
          <ul className="item-grid item-grid--catalogue">
            {results.map(item => <ItemCard key={item.id} item={item} />)}
          </ul>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <p className="empty-state__title">Nothing matches these filters.</p>
            <p>This concept only lists items pictured on ABC’s website, so the range is small. Try fewer words, or ask about something specific.</p>
            <div className="button-row">
              <button type="button" className="button button--primary" onClick={reset}>Reset filters</button>
              <Link to="/contact" className="button button--outline">Ask about a product</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
