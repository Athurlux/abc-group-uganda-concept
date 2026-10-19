// A small, honest catalogue built from images published on ABC's website.
//
// Names describe what the photograph shows. Where the published label disagrees
// with the picture, the picture wins for display and the label is kept as
// `sourceLabel`. Brand, model, finish, dimensions, price, stock and technical
// details are not established for any item, so none are shown: the detail page
// lists them as "to be confirmed" instead. See data/catalogue-starter.json and
// guides/VISUAL_REVIEW_NOTES.md in the asset pack.

export type ItemKind = 'product' | 'packaging' | 'application'

export interface CatalogueItem {
  id: string
  collection: string
  kind: ItemKind
  name: string
  description: string
  /** Alt text as published on the source page, preserved as evidence only. */
  sourceLabel: string
  /** Why the display name differs from the source label, if it does. */
  discrepancy: string | null
  image: string
  width: number
  height: number
  sourcePage: string
  /**
   * Countable unit, only where an item is plainly a discrete piece. Null means the
   * quantity has to be confirmed with ABC (pack sizes and tile areas are unknown).
   */
  unit: 'piece' | null
}

export const KIND_LABELS: Record<ItemKind, string> = {
  product: 'Product photo',
  packaging: 'Packaging image',
  application: 'Application photo',
}

export const CATALOGUE: CatalogueItem[] = [
  {
    id: 'sanitaryware-01',
    collection: 'sanitaryware',
    kind: 'product',
    name: 'White wall-hung toilet',
    description: 'A white, square-edged toilet pan designed to be mounted on the wall, with the cistern hidden behind it.',
    sourceLabel: 'Concealed tank toilet sanitaryware in Uganda',
    discrepancy: null,
    image: 'sanitaryware-01', width: 658, height: 658,
    sourcePage: 'https://abcgroupuganda.com/sanitaryware/',
    unit: 'piece',
  },
  {
    id: 'sanitaryware-02',
    collection: 'sanitaryware',
    kind: 'product',
    name: 'White pedestal basin',
    description: 'A white wash basin standing on a full pedestal, shown with a single-hole mixer.',
    sourceLabel: 'Rectangular basin in Uganda',
    discrepancy: 'The published label says “rectangular basin”, but the photograph shows a pedestal basin with a rounded bowl.',
    image: 'sanitaryware-02', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/sanitaryware/',
    unit: 'piece',
  },
  {
    id: 'sanitaryware-03',
    collection: 'sanitaryware',
    kind: 'product',
    name: 'Single-lever basin mixer',
    description: 'A single-lever basin mixer. In the published photograph it appears gold-toned.',
    sourceLabel: 'Chrome Faucet',
    discrepancy: 'The published label says “chrome faucet”, but the photograph shows a gold-toned finish. The actual finish needs confirming.',
    image: 'sanitaryware-03', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/sanitaryware/',
    unit: 'piece',
  },
  {
    id: 'sanitaryware-04',
    collection: 'sanitaryware',
    kind: 'product',
    name: 'Rectangular bath with clear side panel',
    description: 'A rectangular freestanding bath with a transparent side panel and controls on the rim.',
    sourceLabel: 'Oval bathtub in Uganda',
    discrepancy: 'The published label says “oval bathtub”, but the photograph shows a rectangular bath with a clear side panel.',
    image: 'sanitaryware-04', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/sanitaryware/',
    unit: 'piece',
  },
  {
    id: 'concealed-cistern-02',
    collection: 'concealed-cisterns',
    kind: 'product',
    name: 'Geberit-marked concealed cistern frame',
    description: 'An in-wall cistern frame for a wall-hung toilet, with Geberit marking on the cistern. The exact model is not stated.',
    sourceLabel: 'Geberit Concealed toilet in uganda',
    discrepancy: null,
    image: 'concealed-cistern-02', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/concealed-cistern/',
    unit: 'piece',
  },
  {
    id: 'kitchensinks-01',
    collection: 'kitchen-sinks',
    kind: 'product',
    name: 'Two-bowl sink with pull-down mixer',
    description: 'A dark-finish inset sink with a large and a smaller bowl, shown with a pull-down mixer and a side spray bar.',
    sourceLabel: 'Best kitchen sink for modern homes Uganda',
    discrepancy: 'The asset pack described this as a single-bowl sink; the photograph shows two bowls.',
    image: 'kitchensinks-01', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/kitchensinks/',
    unit: 'piece',
  },
  {
    id: 'kitchensinks-02',
    collection: 'kitchen-sinks',
    kind: 'product',
    name: 'Multi-compartment workstation sink',
    description: 'A dark-finish workstation sink with a removable insert basin, a cup rinser, a lidded compartment, a pull-down mixer and a separate side tap.',
    sourceLabel: 'Premium double bowl kitchen sink in Kampala Uganda',
    discrepancy: null,
    image: 'kitchensinks-02', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/kitchensinks/',
    unit: 'piece',
  },
  {
    id: 'grout-adhesive-01',
    collection: 'grout-adhesive',
    kind: 'packaging',
    name: 'Grout pail (packaging image)',
    description: 'A grout pail with Laticrete-style packaging. Much of the lettering in the published image is garbled, so it may be an illustration rather than a product photograph.',
    sourceLabel: 'Bathroom best waterproof in Uganda',
    discrepancy: 'The published label refers to waterproofing, while the pail is marked as grout. The exact product, grade and pack size cannot be read reliably from the image.',
    image: 'grout-adhesive-01', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/grout-adhesive/',
    unit: null,
  },
  {
    id: 'grout-adhesive-02',
    collection: 'grout-adhesive',
    kind: 'packaging',
    name: 'Tile adhesive bag (packaging image)',
    description: 'A floor and wall tile adhesive bag with MYK Laticrete marking. Parts of the printed text are garbled, so the grade and pack size are not taken from the image.',
    sourceLabel: 'Fast-setting best adhesive in Uganda',
    discrepancy: null,
    image: 'grout-adhesive-02', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/grout-adhesive/',
    unit: null,
  },
  {
    id: 'tiles-01',
    collection: 'tiles',
    kind: 'application',
    name: 'Bathroom with large-format marble-look walls',
    description: 'A bathroom with blue-green marble-look wall tiles and a pale floor. It shows tiles in use, not an isolated tile sample.',
    sourceLabel: '3D-effect tiles in Uganda',
    discrepancy: 'The published label says “3D-effect tiles”; the scene reads as marble-look. The specific tile shown is not identified.',
    image: 'tiles-01', width: 1024, height: 768,
    sourcePage: 'https://abcgroupuganda.com/tiles/',
    unit: null,
  },
  {
    id: 'tiles-02',
    collection: 'tiles',
    kind: 'application',
    name: 'Office with stone-look surfaces and dark floor',
    description: 'A private office with a stone-look desk and dark floor tiles. It shows tiles in use, not an isolated tile sample.',
    sourceLabel: 'Rustic effect tiles in Uganda',
    discrepancy: null,
    image: 'tiles-02', width: 1024, height: 768,
    sourcePage: 'https://abcgroupuganda.com/tiles/',
    unit: null,
  },
  {
    id: 'vox-panels-01',
    collection: 'wall-panels',
    kind: 'application',
    name: 'Balcony with slatted wood-tone panels',
    description: 'A balcony lined with vertical wood-tone slatted panels on the wall and ceiling. It shows panels in use, not an isolated panel.',
    sourceLabel: 'gypsum ceiling design in uganda',
    discrepancy: 'The published label mentions a gypsum ceiling; the panel material shown is not identified.',
    image: 'vox-panels-01', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/vox-panels/',
    unit: null,
  },
  {
    id: 'vox-panels-02',
    collection: 'wall-panels',
    kind: 'application',
    name: 'Covered terrace with wood-tone ceiling',
    description: 'A covered terrace with a slatted wood-tone ceiling above a dining area. It shows panels in use, not an isolated panel.',
    sourceLabel: 'gypsum ceiling design',
    discrepancy: 'The published label mentions a gypsum ceiling; the panel material shown is not identified.',
    image: 'vox-panels-02', width: 1024, height: 1024,
    sourcePage: 'https://abcgroupuganda.com/vox-panels/',
    unit: null,
  },
]

/** Fields that a real catalogue would need and that are not established for any item. */
export const TO_CONFIRM = ['Brand and model', 'Finish and colour', 'Dimensions', 'Technical specifications', 'Price', 'Availability']

export const findItem = (id: string | null | undefined) => CATALOGUE.find(item => item.id === id)
export const itemsIn = (collection: string) => CATALOGUE.filter(item => item.collection === collection)
