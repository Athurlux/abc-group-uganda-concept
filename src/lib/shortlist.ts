import { useSyncExternalStore } from 'react'
import { CATALOGUE, findItem } from '../data/catalogue'
import { findShowroom } from '../data/locations'

// The project shortlist: the one piece of state this site keeps between visits.
// It stores catalogue IDs, piece counts where a piece is the established unit, and
// a preferred showroom — never names, contact details or project notes.

export const STORAGE_KEY = 'abcg-concept-shortlist'
const VERSION = 1
export const MAX_QTY = 99

export interface Entry {
  id: string
  /** Pieces, for discrete items only. Null means "quantity to confirm". */
  qty: number | null
}

export interface ShortlistState {
  items: Entry[]
  showroom: string | null
}

export const EMPTY: ShortlistState = { items: [], showroom: null }

const clampQty = (value: unknown) => {
  const number = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : 1
  return Math.min(MAX_QTY, Math.max(1, number))
}

/** Gives an entry the quantity its item's unit allows: a clamped count, or null. */
function normalise(id: string, qty: unknown): Entry {
  return { id, qty: findItem(id)?.unit === 'piece' ? clampQty(qty) : null }
}

/**
 * Reads stored data defensively. Malformed JSON, another version, unknown IDs and
 * odd quantities are dropped or repaired rather than breaking the page, and
 * duplicate IDs (e.g. from an older build) are merged into one entry.
 */
export function parseShortlist(raw: string | null): ShortlistState {
  if (!raw) return EMPTY
  try {
    const value = JSON.parse(raw) as { version?: unknown; items?: unknown; showroom?: unknown }
    if (!value || value.version !== VERSION || !Array.isArray(value.items)) return EMPTY
    let state: ShortlistState = { items: [], showroom: findShowroom(typeof value.showroom === 'string' ? value.showroom : null)?.slug ?? null }
    for (const entry of value.items as { id?: unknown; qty?: unknown }[]) {
      if (!entry || typeof entry.id !== 'string' || !findItem(entry.id)) continue
      const existing = state.items.find(item => item.id === entry.id)
      if (existing) {
        const extra = normalise(entry.id, entry.qty).qty
        state = setQuantity(state, entry.id, existing.qty !== null && extra !== null ? existing.qty + extra : null)
      } else {
        state = { ...state, items: [...state.items, normalise(entry.id, entry.qty)] }
      }
    }
    return state
  } catch {
    return EMPTY
  }
}

export const serializeShortlist = (state: ShortlistState) => JSON.stringify({ version: VERSION, items: state.items, showroom: state.showroom })

/** Adding something already listed merges into its entry: one more piece, or no change. */
export function addItem(state: ShortlistState, id: string): { state: ShortlistState; result: 'added' | 'merged' | 'unchanged' } {
  const item = findItem(id)
  if (!item) return { state, result: 'unchanged' }
  const existing = state.items.find(entry => entry.id === id)
  if (!existing) return { state: { ...state, items: [...state.items, normalise(id, 1)] }, result: 'added' }
  if (existing.qty === null || existing.qty >= MAX_QTY) return { state, result: 'unchanged' }
  return { state: setQuantity(state, id, existing.qty + 1), result: 'merged' }
}

export const removeItem = (state: ShortlistState, id: string): ShortlistState => ({ ...state, items: state.items.filter(entry => entry.id !== id) })

/** Quantities apply only to piece-counted items; others always stay "to confirm". */
export function setQuantity(state: ShortlistState, id: string, qty: number | null): ShortlistState {
  return { ...state, items: state.items.map(entry => (entry.id === id ? normalise(id, qty) : entry)) }
}

export const setShowroom = (state: ShortlistState, slug: string | null): ShortlistState => ({ ...state, showroom: findShowroom(slug)?.slug ?? null })

/** Describes an entry's quantity without inventing a unit. */
export const quantityLabel = (entry: Entry) => (entry.qty === null ? 'Quantity to confirm' : `${entry.qty} ${entry.qty === 1 ? 'piece' : 'pieces'}`)

// ---- Store -----------------------------------------------------------------------

let current: ShortlistState = EMPTY
let loaded = false
// The list as it was before the last "clear", kept in memory only so the clear can be
// undone from whichever control is on screen afterwards. Any later change drops it.
let cleared: ShortlistState | null = null
const listeners = new Set<() => void>()

function read() {
  if (!loaded) {
    loaded = true
    try { current = parseShortlist(localStorage.getItem(STORAGE_KEY)) } catch { current = EMPTY }
  }
  return current
}

function commit(next: ShortlistState, keepUndo = false) {
  if (!keepUndo) cleared = null
  current = next
  try { localStorage.setItem(STORAGE_KEY, serializeShortlist(next)) } catch { /* storage unavailable: keep it for this visit */ }
  listeners.forEach(listener => listener())
}

export const shortlist = {
  /** Current state, read outside React (e.g. when a form completes). */
  snapshot: () => read(),
  /** Returns what happened and the entry as it now stands, for feedback. */
  add(id: string) {
    const { state, result } = addItem(read(), id)
    commit(state)
    return { result, entry: state.items.find(entry => entry.id === id) ?? null }
  },
  remove: (id: string) => commit(removeItem(read(), id)),
  setQuantity: (id: string, qty: number | null) => commit(setQuantity(read(), id, qty)),
  setShowroom: (slug: string | null) => commit(setShowroom(read(), slug)),
  /** Empties the list, remembering it (in memory) so the clear can be undone. */
  clear() {
    const previous = read()
    if (!previous.items.length) return
    commit({ ...previous, items: [] }, true)
    cleared = previous
    listeners.forEach(listener => listener())
  },
  undoClear() {
    if (cleared) commit(cleared)
  },
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Keep other tabs in step: they write the same key.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    current = parseShortlist(event.newValue)
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); window.removeEventListener('storage', onStorage) }
}

export const useShortlist = () => useSyncExternalStore(subscribe, read, () => EMPTY)
export const useCanUndoClear = () => useSyncExternalStore(subscribe, () => cleared !== null, () => false)

/** Shortlist entries joined to their catalogue items, skipping anything unknown. */
export const withItems = (state: ShortlistState) =>
  state.items.flatMap(entry => {
    const item = CATALOGUE.find(candidate => candidate.id === entry.id)
    return item ? [{ entry, item }] : []
  })
