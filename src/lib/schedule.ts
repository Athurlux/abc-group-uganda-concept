import { addDays, futureDateError, kampalaParts } from './validation'

// Illustrative preferences only. ABC publishes no opening hours, so these windows
// are not availability and the form never says they are.
export const VISIT_WINDOWS = [
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Around midday' },
  { value: 'afternoon', label: 'Afternoon' },
]

export const VISIT_MAX_DAYS = 60

/** Earliest selectable day: tomorrow in Kampala, so a same-day visit is never implied. */
export const earliestVisitDate = (now = new Date()) => addDays(kampalaParts(now).date, 1)

export function visitDateError(date: string, now = new Date()): string | null {
  const base = futureDateError(date, now, { maxDays: VISIT_MAX_DAYS, label: 'a preferred date' })
  if (base) return base
  if (date < earliestVisitDate(now)) return 'Choose tomorrow or a later date (Kampala time).'
  return null
}
