import { Link, Navigate, useParams } from 'react-router'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ItemImg } from '../components/Img'
import { ItemCard } from '../components/ItemCard'
import { AddToShortlist } from '../components/ShortlistControls'
import { CATALOGUE, KIND_LABELS, TO_CONFIRM, findItem } from '../data/catalogue'
import { findCollection } from '../data/collections'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

const KIND_NOTES = {
  product: 'Product photograph published on ABC’s website.',
  packaging: 'Packaging image published on ABC’s website. Its printed text is not treated as product information.',
  application: 'Application photograph: it shows the material in use in a room, not an isolated product.',
}

export default function ItemDetail() {
  const { slug, itemId } = useParams()
  const item = findItem(itemId)
  useDocumentTitle(item?.name ?? 'Selection not found')
  if (!item) return <NotFound what="selection" />
  // A stale link with the wrong collection goes to the item's real address.
  if (item.collection !== slug) return <Navigate to={`/collections/${item.collection}/${item.id}`} replace />

  const collection = findCollection(item.collection)!
  const related = [...CATALOGUE.filter(other => other.collection === item.collection && other.id !== item.id), ...CATALOGUE.filter(other => other.collection !== item.collection)].slice(0, 3)

  return (
    <article className="container item">
      <Breadcrumbs trail={[{ label: 'Collections', to: '/collections' }, { label: collection.name, to: `/collections/${collection.slug}` }, { label: item.name }]} />
      <div className="item__grid">
        <figure className={`item__media item__media--${item.kind}`}>
          <ItemImg item={item} alt={item.description} sizes="(min-width: 1024px) 50vw, 100vw" priority />
          <figcaption>{KIND_NOTES[item.kind]}</figcaption>
        </figure>

        <div className="item__info">
          <p className="kicker">{collection.name} · {KIND_LABELS[item.kind]}</p>
          <h1>{item.name}</h1>
          <p className="lede">{item.description}</p>

          <div className="item__actions">
            <AddToShortlist id={item.id} name={item.name} />
            <Link to={`/contact?item=${item.id}`} className="button button--outline">Request product details</Link>
          </div>
          <p className="item__unit">
            {item.unit === 'piece'
              ? 'Counted in pieces on your shortlist. Add it again to increase the count.'
              : 'Shortlisted with “quantity to confirm”: area or pack size needs measuring with ABC.'}
          </p>

          <section className="facts" aria-labelledby="known-title">
            <h2 id="known-title">What is known</h2>
            <dl>
              <div><dt>Collection</dt><dd><Link to={`/collections/${collection.slug}`}>{collection.name}</Link></dd></div>
              <div><dt>Image</dt><dd>{KIND_LABELS[item.kind]}, from <a href={item.sourcePage} rel="noopener">ABC’s {collection.name.toLowerCase()} page</a></dd></div>
            </dl>
          </section>

          <section className="facts facts--pending" aria-labelledby="pending-title">
            <h2 id="pending-title">Details to be confirmed</h2>
            <dl>{TO_CONFIRM.map(field => <div key={field}><dt>{field}</dt><dd>To be confirmed</dd></div>)}</dl>
            <p className="fine-print">These are not published for this item. Use “Request product details” rather than relying on the photograph.</p>
          </section>

          {item.discrepancy && (
            <details className="source-label">
              <summary>About this image’s published label</summary>
              <p>Published label: “{item.sourceLabel}”.</p>
              <p>{item.discrepancy}</p>
            </details>
          )}

          <p className="item__visit">Want to see it first? <Link to="/showrooms/visit">Plan a showroom visit</Link>.</p>
        </div>
      </div>

      <section className="section section--tight related" aria-labelledby="related-title">
        <h2 className="section-title" id="related-title">Related selections</h2>
        <ul className="item-grid item-grid--catalogue">{related.map(other => <ItemCard key={other.id} item={other} />)}</ul>
      </section>
    </article>
  )
}
