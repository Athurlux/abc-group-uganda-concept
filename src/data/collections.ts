// The six groups on ABC's homepage. Summaries paraphrase each category page and are
// attributed as such; brand names are listed only where the page itself names them.

export interface Collection {
  slug: string
  name: string
  short: string
  sourcePage: string
  /** What the category page lists, in its own terms. */
  published: string[]
  /** Brands named in the category page's text or captions (not verified partnerships). */
  brandsNamed: string[]
  /** Catalogue image used for the collection tile. */
  cover: string
  /** Related generated inspiration scene, if any. */
  inspiration: string | null
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'tiles',
    name: 'Tiles and flooring',
    short: 'Porcelain and ceramic tiles for floors, walls and outdoor spaces.',
    sourcePage: 'https://abcgroupuganda.com/tiles/',
    published: [
      'Porcelain, ceramic and big-slab tiles',
      'Wood-look, marble-effect, stone-effect, rustic, 3D-effect, hexagon and patterned looks',
      'Matte, gloss, anti-slip and textured finishes',
      'Outdoor, pool and staircase tiles',
      'A range of sizes listed from 300 × 450 mm to 1200 × 3600 mm, with custom sizes mentioned',
    ],
    brandsNamed: ['STN', 'Imola', 'Tuscania', 'Granitogres', 'Simpolo', 'Viceroy'],
    cover: 'tiles-01',
    inspiration: 'living-room-flooring',
  },
  {
    slug: 'sanitaryware',
    name: 'Sanitaryware and fittings',
    short: 'Toilets, basins, baths, mixers and the fittings around them.',
    sourcePage: 'https://abcgroupuganda.com/sanitaryware/',
    published: [
      'Toilets, urinals and wash basins',
      'Faucets and shower sets',
      'Bathroom vanities, mirrors and accessories',
      'Jacuzzis, bathtubs and shower rooms',
      'Water heaters',
    ],
    brandsNamed: ['Hansgrohe', 'BATHX'],
    cover: 'sanitaryware-04',
    inspiration: 'garden-bathroom',
  },
  {
    slug: 'grout-adhesive',
    name: 'Grout and adhesive',
    short: 'Tile adhesives and grouts for fixing and finishing tiled surfaces.',
    sourcePage: 'https://abcgroupuganda.com/grout-adhesive/',
    published: [
      'Tile adhesives and grouts',
      'For ceramic, porcelain and natural stone tiles',
      'For residential and commercial work, indoors and out',
    ],
    brandsNamed: ['Laticrete'],
    cover: 'grout-adhesive-02',
    inspiration: null,
  },
  {
    slug: 'concealed-cisterns',
    name: 'Concealed cisterns',
    short: 'In-wall cistern systems for wall-hung toilets.',
    sourcePage: 'https://abcgroupuganda.com/concealed-cistern/',
    published: [
      'Concealed cisterns designed to sit behind the wall',
      'Paired with wall-hung toilets',
      'For residential and commercial bathrooms',
    ],
    brandsNamed: ['Geberit', 'Laufen', 'Schwab', 'Italian Standard'],
    cover: 'concealed-cistern-02',
    inspiration: 'garden-bathroom',
  },
  {
    slug: 'wall-panels',
    name: 'Wall and ceiling panels',
    short: 'Decorative panels in wood, stone and contemporary finishes.',
    sourcePage: 'https://abcgroupuganda.com/vox-panels/',
    published: [
      'Vox decorative wall panels, described as coming from Poland',
      'Wood, stone and contemporary finishes',
      'For living rooms, offices and commercial spaces',
    ],
    brandsNamed: ['Vox'],
    cover: 'vox-panels-01',
    inspiration: 'slatted-entrance',
  },
  {
    slug: 'kitchen-sinks',
    name: 'Kitchen sinks',
    short: 'Single- and double-bowl sinks, with fittings and accessories.',
    sourcePage: 'https://abcgroupuganda.com/kitchensinks/',
    published: [
      'Single- and double-bowl sinks',
      'Countertop sinks and sinks supplied with a faucet',
      'Stainless steel sinks, dish racks, drainboards and waste systems',
    ],
    brandsNamed: ['Carysil', 'Becken'],
    cover: 'kitchensinks-02',
    inspiration: 'open-kitchen',
  },
]

export const findCollection = (slug: string | null | undefined) => COLLECTIONS.find(collection => collection.slug === slug)
