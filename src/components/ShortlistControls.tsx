import { Link } from 'react-router'
import { COLLECTIONS } from '../data/collections'
import { KIND_LABELS } from '../data/catalogue'
import { MAX_QTY, quantityLabel, shortlist, useCanUndoClear, useShortlist, withItems } from '../lib/shortlist'
import { announce } from './Announcer'
import { Icon } from './Icon'
import { ItemImg } from './Img'

const collectionName = (slug: string) => COLLECTIONS.find(collection => collection.slug === slug)?.name ?? ''

/** Adds an item, or merges into its existing entry, and says which happened. */
export function AddToShortlist({ id, name, compact = false }: { id: string; name: string; compact?: boolean }) {
  const entry = useShortlist().items.find(item => item.id === id)
  const onClick = () => {
    const { result, entry: now } = shortlist.add(id)
    if (result === 'added') announce(`${name} added to your project shortlist`)
    else if (result === 'merged' && now) announce(`${name}: now ${quantityLabel(now)} on your shortlist`)
    else announce(`${name} is already on your shortlist`)
  }
  return (
    <button
      type="button"
      className={`button ${compact ? 'button--small' : ''} ${entry ? 'button--saved' : 'button--primary'}`}
      onClick={onClick}
      aria-label={compact ? `Add ${name} to shortlist` : undefined}
    >
      <Icon name={entry ? 'check' : 'shortlist'} size={18} />
      {entry ? (entry.qty === null ? 'On your shortlist' : `On shortlist (${quantityLabel(entry)})`) : 'Add to shortlist'}
    </button>
  )
}

export function QuantityControl({ id, qty, name }: { id: string; qty: number | null; name: string }) {
  if (qty === null) return <p className="qty qty--confirm">Quantity to confirm</p>
  return (
    <div className="qty" role="group" aria-label={`Pieces of ${name}`}>
      <button type="button" className="qty__btn" aria-label={`One fewer ${name}`} disabled={qty <= 1} onClick={() => shortlist.setQuantity(id, qty - 1)}><Icon name="minus" size={16} /></button>
      <span className="qty__value" aria-live="polite">{qty} {qty === 1 ? 'piece' : 'pieces'}</span>
      <button type="button" className="qty__btn" aria-label={`One more ${name}`} disabled={qty >= MAX_QTY} onClick={() => shortlist.setQuantity(id, qty + 1)}><Icon name="plus" size={16} /></button>
    </div>
  )
}

/** The shortlist as a list: used by the drawer, the shortlist page and the quote's first step. */
export function ShortlistList({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const rows = withItems(useShortlist())
  return (
    <ul className={`shortlist-list ${compact ? 'shortlist-list--compact' : ''}`}>
      {rows.map(({ entry, item }) => (
        <li key={item.id} className="shortlist-row">
          <Link to={`/collections/${item.collection}/${item.id}`} className="shortlist-row__image" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
            <ItemImg item={item} alt="" sizes="96px" />
          </Link>
          <div className="shortlist-row__text">
            <p className="shortlist-row__meta">{collectionName(item.collection)} · {KIND_LABELS[item.kind]}</p>
            <Link to={`/collections/${item.collection}/${item.id}`} className="shortlist-row__name" onClick={onNavigate}>{item.name}</Link>
            <QuantityControl id={item.id} qty={entry.qty} name={item.name} />
          </div>
          <button type="button" className="icon-button" aria-label={`Remove ${item.name}`} onClick={() => { shortlist.remove(item.id); announce(`${item.name} removed`) }}>
            <Icon name="close" size={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Clearing is reversible: Undo stays available until the shortlist changes again. */
export function ClearShortlist() {
  const canUndo = useCanUndoClear()
  const count = useShortlist().items.length
  if (canUndo) {
    return (
      <p className="clear-undo" role="status">
        Shortlist cleared.{' '}
        <button type="button" className="text-button" onClick={() => { shortlist.undoClear(); announce('Shortlist restored') }}>Undo</button>
      </p>
    )
  }
  if (!count) return null
  return <button type="button" className="text-button" onClick={() => shortlist.clear()}>Clear shortlist</button>
}

export function EmptyShortlist() {
  return (
    <div className="empty-state">
      <Icon name="shortlist" size={28} />
      <p className="empty-state__title">Your project shortlist is empty.</p>
      <p>Save products and application ideas as you browse. They stay on this device, so you can come back to them.</p>
      <Link to="/collections" className="button button--primary">Explore collections</Link>
    </div>
  )
}
