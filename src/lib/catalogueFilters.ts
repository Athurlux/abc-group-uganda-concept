import { CATALOGUE, KIND_LABELS, type CatalogueItem, type ItemKind } from '../data/catalogue'
import { COLLECTIONS } from '../data/collections'

// Only filters the data can honestly support: collection and image type. There is
// no brand, finish, size or application filter because those fields are unknown.

export type Sort = 'collection' | 'name'

export interface CatalogueFilters {
  q: string
  collection: string | null
  kind: ItemKind | null
  sort: Sort
}

export const DEFAULT_FILTERS: CatalogueFilters = { q: '', collection: null, kind: null, sort: 'collection' }

const KINDS = Object.keys(KIND_LABELS) as ItemKind[]

/** Unknown or tampered values are ignored rather than producing an empty grid. */
export function parseFilters(params: URLSearchParams): CatalogueFilters {
  const collection = params.get('collection')
  const kind = params.get('type') as ItemKind | null
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    collection: COLLECTIONS.some(item => item.slug === collection) ? collection : null,
    kind: kind && KINDS.includes(kind) ? kind : null,
    sort: params.get('sort') === 'name' ? 'name' : 'collection',
  }
}

export function filtersToParams(filters: CatalogueFilters) {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set('q', filters.q.trim())
  if (filters.collection) params.set('collection', filters.collection)
  if (filters.kind) params.set('type', filters.kind)
  if (filters.sort !== 'collection') params.set('sort', filters.sort)
  return params
}

const normalise = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')

const collectionName = (slug: string) => COLLECTIONS.find(collection => collection.slug === slug)?.name ?? ''
const collectionOrder = (slug: string) => COLLECTIONS.findIndex(collection => collection.slug === slug)

/** Every query word must appear in the item's name, description, collection or type. */
export function filterCatalogue(filters: CatalogueFilters, items: CatalogueItem[] = CATALOGUE) {
  const words = normalise(filters.q).split(/\s+/).filter(Boolean)
  const matches = items.filter(item => {
    if (filters.collection && item.collection !== filters.collection) return false
    if (filters.kind && item.kind !== filters.kind) return false
    if (!words.length) return true
    const haystack = normalise([item.name, item.description, collectionName(item.collection), KIND_LABELS[item.kind]].join(' '))
    return words.every(word => haystack.includes(word))
  })
  return [...matches].sort((a, b) =>
    filters.sort === 'name'
      ? a.name.localeCompare(b.name, 'en')
      : collectionOrder(a.collection) - collectionOrder(b.collection) || CATALOGUE.indexOf(a) - CATALOGUE.indexOf(b),
  )
}

/** Active filters as removable chips. Sorting is a view choice, not a filter, so it has no chip. */
export function activeChips(filters: CatalogueFilters) {
  const chips: { key: keyof CatalogueFilters; label: string }[] = []
  if (filters.q.trim()) chips.push({ key: 'q', label: `“${filters.q.trim()}”` })
  if (filters.collection) chips.push({ key: 'collection', label: collectionName(filters.collection) })
  if (filters.kind) chips.push({ key: 'kind', label: KIND_LABELS[filters.kind] })
  return chips
}
