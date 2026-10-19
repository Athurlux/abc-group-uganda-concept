import { describe, expect, it } from 'vitest'
import { CATALOGUE, findItem } from '../data/catalogue'
import { briefFlow, contactFlow, quoteFlow, visitFlow, type QuoteDraft } from '../forms/flows'
import { firstIncompleteIndex, pruneHidden, reviewSections, validateStage, type Draft, type FlowSpec } from '../forms/engine'
import { resolveStep } from '../forms/useFormFlow'
import { activeChips, filterCatalogue, filtersToParams, parseFilters, DEFAULT_FILTERS } from './catalogueFilters'
import { earliestVisitDate, visitDateError } from './schedule'
import { EMPTY, MAX_QTY, addItem, parseShortlist, quantityLabel, removeItem, serializeShortlist, setQuantity, setShowroom } from './shortlist'
import { addDays } from './validation'

// 23:30 in Kampala (UTC+3) on 19 October 2026, still the 19th in UTC.
const LATE = new Date('2026-10-19T20:30:00Z')
// 00:30 in Kampala on 20 October, while UTC is still the 19th.
const AFTER_MIDNIGHT = new Date('2026-10-19T21:30:00Z')
const filled = <T extends Draft>(flow: FlowSpec<T>, today = '2026-10-19') => ({ ...flow.empty(), ...flow.sample(today) }) as T

describe('shortlist', () => {
  it('adds a piece-counted item with one piece and a to-confirm item with no quantity', () => {
    let state = addItem(EMPTY, 'sanitaryware-02').state
    state = addItem(state, 'tiles-01').state
    expect(state.items).toEqual([{ id: 'sanitaryware-02', qty: 1 }, { id: 'tiles-01', qty: null }])
  })

  it('merges a repeat add into the existing entry instead of duplicating it', () => {
    let { state } = addItem(EMPTY, 'kitchensinks-02')
    const second = addItem(state, 'kitchensinks-02')
    expect(second.result).toBe('merged')
    expect(second.state.items).toEqual([{ id: 'kitchensinks-02', qty: 2 }])
    state = addItem(addItem(EMPTY, 'grout-adhesive-01').state, 'grout-adhesive-01').state
    expect(state.items).toEqual([{ id: 'grout-adhesive-01', qty: null }])
  })

  it('caps counts, never goes below one, and refuses quantities for to-confirm items', () => {
    let state = addItem(EMPTY, 'sanitaryware-01').state
    state = setQuantity(state, 'sanitaryware-01', 500)
    expect(state.items[0].qty).toBe(MAX_QTY)
    expect(addItem(state, 'sanitaryware-01').result).toBe('unchanged')
    expect(setQuantity(state, 'sanitaryware-01', 0).items[0].qty).toBe(1)
    const tiles = setQuantity(addItem(EMPTY, 'tiles-02').state, 'tiles-02', 40)
    expect(tiles.items[0].qty).toBeNull()
  })

  it('removes one entry and leaves the rest', () => {
    const state = addItem(addItem(EMPTY, 'sanitaryware-01').state, 'vox-panels-01').state
    expect(removeItem(state, 'sanitaryware-01').items).toEqual([{ id: 'vox-panels-01', qty: null }])
  })

  it('round-trips through storage with IDs, counts and showroom only', () => {
    const state = setShowroom(addItem(EMPTY, 'sanitaryware-03').state, 'hauz')
    const raw = serializeShortlist(state)
    expect(JSON.parse(raw)).toEqual({ version: 1, items: [{ id: 'sanitaryware-03', qty: 1 }], showroom: 'hauz' })
    expect(parseShortlist(raw)).toEqual(state)
  })

  it('recovers from malformed, outdated or tampered storage', () => {
    expect(parseShortlist('{not json')).toEqual(EMPTY)
    expect(parseShortlist(JSON.stringify({ version: 0, items: [{ id: 'sanitaryware-01', qty: 1 }] }))).toEqual(EMPTY)
    expect(parseShortlist(JSON.stringify({ version: 1, items: 'nope' }))).toEqual(EMPTY)
    const tampered = parseShortlist(JSON.stringify({
      version: 1,
      showroom: 'warehouse',
      items: [
        { id: 'sanitaryware-01', qty: 2 }, { id: 'made-up' }, null, { id: 'sanitaryware-01', qty: 3 },
        { id: 'tiles-01', qty: 12 }, { id: 'sanitaryware-02', qty: 'lots' }, { id: 'sanitaryware-04', qty: -5 },
      ],
    }))
    expect(tampered.items).toEqual([
      { id: 'sanitaryware-01', qty: 5 },
      { id: 'tiles-01', qty: null },
      { id: 'sanitaryware-02', qty: 1 },
      { id: 'sanitaryware-04', qty: 1 },
    ])
    // The warehouse is not a showroom, so it cannot become a visit preference.
    expect(tampered.showroom).toBeNull()
  })

  it('labels quantities without mixing units or inventing totals', () => {
    expect(quantityLabel({ id: 'sanitaryware-01', qty: 1 })).toBe('1 piece')
    expect(quantityLabel({ id: 'sanitaryware-01', qty: 3 })).toBe('3 pieces')
    expect(quantityLabel({ id: 'tiles-01', qty: null })).toBe('Quantity to confirm')
  })

  it('uses a piece unit only for discrete products', () => {
    for (const item of CATALOGUE) expect(item.unit === 'piece', item.id).toBe(item.kind === 'product')
  })
})

describe('catalogue', () => {
  it('names items by what the photo shows, keeping the disputed source label', () => {
    expect(findItem('sanitaryware-02')).toMatchObject({ name: 'White pedestal basin', sourceLabel: 'Rectangular basin in Uganda' })
    expect(findItem('sanitaryware-04')?.name).not.toMatch(/oval/i)
    expect(findItem('kitchensinks-01')?.name).not.toMatch(/single/i)
    expect(findItem('concealed-cistern-01')).toBeUndefined() // a logo, not a product
  })

  it('searches every word, filters by collection and type, and sorts', () => {
    const ids = (q: string, extra = {}) => filterCatalogue({ ...DEFAULT_FILTERS, q, ...extra }).map(item => item.id)
    expect(ids('pedestal')).toEqual(['sanitaryware-02'])
    expect(ids('sink mixer')).toEqual(['kitchensinks-01', 'kitchensinks-02'])
    expect(ids('', { collection: 'wall-panels' })).toEqual(['vox-panels-01', 'vox-panels-02'])
    expect(ids('', { kind: 'packaging' })).toEqual(['grout-adhesive-01', 'grout-adhesive-02'])
    expect(ids('nothing-like-this')).toEqual([])
    const byName = filterCatalogue({ ...DEFAULT_FILTERS, sort: 'name' }).map(item => item.name)
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b, 'en')))
  })

  it('ignores unknown URL values and round-trips known ones', () => {
    expect(parseFilters(new URLSearchParams('collection=fake&type=sku&sort=price&q=bath'))).toEqual({ ...DEFAULT_FILTERS, q: 'bath' })
    const filters = { q: 'sink', collection: 'kitchen-sinks', kind: 'product' as const, sort: 'name' as const }
    expect(parseFilters(filtersToParams(filters))).toEqual(filters)
    expect(activeChips(filters).map(chip => chip.key)).toEqual(['q', 'collection', 'kind'])
  })
})

describe('visit dates (Africa/Kampala)', () => {
  it('rejects past dates and today, and accepts tomorrow onwards', () => {
    expect(visitDateError('2026-10-18', LATE)).toMatch(/today or a later date/)
    expect(visitDateError('2026-10-19', LATE)).toMatch(/tomorrow or a later date/)
    expect(visitDateError('2026-10-20', LATE)).toBeNull()
  })

  it('uses the Kampala date after midnight there, not the UTC date', () => {
    expect(earliestVisitDate(AFTER_MIDNIGHT)).toBe('2026-10-21')
    expect(visitDateError('2026-10-20', AFTER_MIDNIGHT)).not.toBeNull()
  })

  it('bounds the range and rejects impossible dates', () => {
    expect(visitDateError(addDays('2026-10-19', 60), LATE)).toBeNull()
    expect(visitDateError(addDays('2026-10-19', 61), LATE)).toMatch(/within the next 60 days/)
    expect(visitDateError('2026-11-31', LATE)).toBe('Enter a valid date.')
  })
})

describe('form validation', () => {
  it('asks for an organisation only when the visitor is not a homeowner, and prunes it otherwise', () => {
    const base = filled(quoteFlow)
    const project = quoteFlow.stages[1]
    expect(project.fields.find(field => field.name === 'organisation')?.when?.({ ...base, role: 'homeowner' })).toBe(false)
    expect(project.fields.find(field => field.name === 'organisation')?.when?.({ ...base, role: 'contractor' })).toBe(true)
    const other = { ...base, projectType: 'other', projectTypeOther: null } as QuoteDraft
    expect(validateStage(project, other).projectTypeOther).toBe('Describe the project type in a few words.')
    const switched = { ...other, projectTypeOther: 'Church hall', projectType: 'residential' }
    expect(pruneHidden(quoteFlow, switched).projectTypeOther).toBeNull()
    expect(reviewSections(quoteFlow, switched)[1].entries.map(entry => entry.name)).not.toContain('projectTypeOther')
  })

  it('validates contact details and requires a showroom choice', () => {
    const contact = quoteFlow.stages[2]
    const errors = validateStage(contact, { ...filled(quoteFlow), email: 'nope', phone: '123', showroom: null })
    expect(errors.email).toMatch(/name@example.com/)
    expect(errors.phone).toMatch(/Ugandan number/)
    expect(errors.showroom).toMatch(/No preference/)
  })

  it('accepts email or phone where either will do, but not neither', () => {
    expect(validateStage(contactFlow.stages[1], { ...contactFlow.empty(), fullName: 'A' }).contactMethod).toMatch(/email address or a phone number/)
    expect(validateStage(visitFlow.stages[1], { ...visitFlow.empty(), fullName: 'A', phone: '+256 772 123456' })).toEqual({})
  })

  it('rejects an unknown showroom value in a visit request', () => {
    const errors = validateStage(visitFlow.stages[0], { ...filled(visitFlow), showroom: 'warehouse' }, LATE)
    expect(errors.showroom).toBe('Choose a showroom.')
  })

  it('every sample completes its flow, and a direct link cannot skip steps', () => {
    for (const flow of [quoteFlow, briefFlow, contactFlow] as FlowSpec<any>[]) expect(firstIncompleteIndex(flow, filled(flow), LATE), flow.key).toBe(flow.stages.length)
    expect(firstIncompleteIndex(visitFlow, filled(visitFlow), LATE)).toBe(visitFlow.stages.length)
    expect(resolveStep(quoteFlow, quoteFlow.empty(), 'review')).toBe('project')
  })
})
