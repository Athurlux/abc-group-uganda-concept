import { Link } from 'react-router'
import { KIND_LABELS, type CatalogueItem } from '../data/catalogue'
import { COLLECTIONS } from '../data/collections'
import { ItemImg } from './Img'
import { AddToShortlist } from './ShortlistControls'

export function ItemCard({ item }: { item: CatalogueItem }) {
  const collection = COLLECTIONS.find(entry => entry.slug === item.collection)
  return (
    <li className={`item-card item-card--${item.kind}`} data-anim="card">
      <Link to={`/collections/${item.collection}/${item.id}`} className="item-card__link">
        <span className="item-card__image"><ItemImg item={item} alt={item.name} sizes="(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 100vw" /></span>
        <span className="item-card__collection">{collection?.name} · {KIND_LABELS[item.kind]}</span>
        <span className="item-card__name">{item.name}</span>
      </Link>
      <AddToShortlist id={item.id} name={item.name} compact />
    </li>
  )
}
