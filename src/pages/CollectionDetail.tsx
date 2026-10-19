import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { useSiteMotion } from '../animation/useSiteMotion'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SceneImg } from '../components/Img'
import { ItemCard } from '../components/ItemCard'
import { findCollection } from '../data/collections'
import { itemsIn } from '../data/catalogue'
import { findScene } from '../data/inspiration'
import { CHECKED_ON } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = findCollection(slug)
  useDocumentTitle(collection?.name ?? 'Collection not found')
  const root = useRef<HTMLDivElement>(null)
  useSiteMotion(root)
  if (!collection) return <NotFound what="collection" />

  const items = itemsIn(collection.slug)
  const scene = findScene(collection.inspiration ?? undefined)

  return (
    <div ref={root}>
      <header className="page-intro">
        <div className="container">
          <Breadcrumbs trail={[{ label: 'Collections', to: '/collections' }, { label: collection.name }]} />
          <h1>{collection.name}</h1>
          <p className="lede">{collection.short}</p>
        </div>
      </header>

      <section className="container section section--tight" aria-labelledby="range-title">
        <div className="range">
          <div>
            <h2 className="section-title" id="range-title">What ABC lists in this range</h2>
            <ul className="check-list">{collection.published.map(line => <li key={line}>{line}</li>)}</ul>
            {collection.brandsNamed.length > 0 && (
              <p className="range__brands"><strong>Brands named on ABC’s page:</strong> {collection.brandsNamed.join(', ')}. Availability of any brand is to be confirmed.</p>
            )}
            <p className="source-note">Summarised from ABC’s <a href={collection.sourcePage} rel="noopener">{collection.name.toLowerCase()} page</a>, checked {CHECKED_ON}. It describes the range, not current stock.</p>
          </div>
          <div className="range__cta">
            <p>Can’t see what you need? The pictured items are only a small part of the range.</p>
            <Link to="/contact" className="button button--outline">Ask about this collection</Link>
            <Link to="/showrooms" className="button button--ghost">Find a showroom</Link>
          </div>
        </div>
      </section>

      <section className="container section section--tight" aria-labelledby="items-title">
        <h2 className="section-title" id="items-title">Pictured selections <span className="count-label">({items.length})</span></h2>
        <ul className="item-grid item-grid--catalogue">{items.map(item => <ItemCard key={item.id} item={item} />)}</ul>
      </section>

      {scene && (
        <section className="section section--stone" aria-labelledby="scene-title">
          <div className="container split">
            <figure className="split__image" data-anim="image"><SceneImg name={scene.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" /></figure>
            <div className="split__text" data-anim="reveal">
              <p className="kicker">Inspiration</p>
              <h2 className="section-title" id="scene-title">{scene.title}</h2>
              <p>{scene.summary}</p>
              <p className="fine-print">A generated, fictional room. It does not show specific ABC products.</p>
              <Link to={`/inspiration/${scene.slug}`} className="text-link">See the ideas behind this room</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
