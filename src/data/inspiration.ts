// Generated inspiration. Four separate, fictional spaces (not one home, not client
// projects, not ABC installations) plus four generic texture references. Nothing
// here identifies a stocked product; finishes are labelled as illustrative.

export const ILLUSTRATIVE_FINISH = 'Illustrative finish — not a stocked product'

export interface Finish {
  id: 'limestone' | 'marble' | 'charcoal' | 'walnut'
  name: string
  note: string
}

export const FINISHES: Finish[] = [
  { id: 'limestone', name: 'Warm limestone', note: 'A soft, low-contrast stone look that keeps large floors calm.' },
  { id: 'marble', name: 'Veined white marble', note: 'Movement and light, suited to a feature surface rather than every surface.' },
  { id: 'charcoal', name: 'Charcoal slate', note: 'A deep, matte counterweight to pale stone and timber.' },
  { id: 'walnut', name: 'Walnut timber', note: 'Warm grain that softens stone-heavy rooms.' },
]

export interface Scene {
  slug: string
  title: string
  room: string
  image: string
  summary: string
  ideas: { title: string; body: string }[]
  finishes: Finish['id'][]
  collections: string[]
}

export const SCENES: Scene[] = [
  {
    slug: 'living-room-flooring',
    title: 'One floor, from inside to the terrace',
    room: 'Living room',
    image: 'living-flooring',
    summary: 'A large living space where a single stone-look floor runs uninterrupted towards open glazing, so the room reads as one calm plane.',
    ideas: [
      { title: 'Keep the floor continuous', body: 'Fewer changes of material make a big room feel bigger and quieter.' },
      { title: 'Choose low contrast for large areas', body: 'A soft stone look hides everyday dust better than very dark or very white floors.' },
      { title: 'Ask about outdoor-rated options', body: 'If the floor continues outside, ask which tiles are suitable for exterior use before choosing a look.' },
    ],
    finishes: ['limestone', 'charcoal'],
    collections: ['tiles', 'grout-adhesive'],
  },
  {
    slug: 'garden-bathroom',
    title: 'A bathroom that borrows the garden',
    room: 'Bathroom',
    image: 'bathroom-inspiration',
    summary: 'Warm stone walls, a timber vanity and a freestanding bath, arranged so the planting outside becomes part of the room.',
    ideas: [
      { title: 'One stone, many surfaces', body: 'Running a single stone look across walls and floor gives a bathroom a built-in feel.' },
      { title: 'Plan fittings early', body: 'Concealed cisterns and wall-hung pieces need decisions before walls are finished.' },
      { title: 'Confirm wet-area suitability', body: 'A look is not a specification. Check each surface’s suitability for wet areas with ABC.' },
    ],
    finishes: ['limestone', 'walnut'],
    collections: ['sanitaryware', 'concealed-cisterns', 'tiles'],
  },
  {
    slug: 'open-kitchen',
    title: 'A kitchen built around the island',
    room: 'Kitchen',
    image: 'kitchen-inspiration',
    summary: 'A long stone-look island with timber cabinetry, open to a dining area and the view beyond.',
    ideas: [
      { title: 'Let the island lead', body: 'A single strong surface on the island lets cabinets and walls stay simple.' },
      { title: 'Choose the sink with the worktop', body: 'Bowl layout and accessories shape how the island works day to day.' },
      { title: 'Repeat materials sparingly', body: 'Echo the island’s tone once elsewhere, on a backsplash or shelf, rather than everywhere.' },
    ],
    finishes: ['marble', 'walnut'],
    collections: ['kitchen-sinks', 'tiles'],
  },
  {
    slug: 'slatted-entrance',
    title: 'An entrance lined in timber slats',
    room: 'Entrance',
    image: 'wall-panels-inspiration',
    summary: 'A double-height entrance where slatted wood-tone panels and concealed lighting turn a plain wall into the first thing you notice.',
    ideas: [
      { title: 'Use panels where people pause', body: 'Entrances, reception walls and bedheads reward a tactile surface.' },
      { title: 'Light the texture', body: 'A grazing light along slats shows their depth far better than a ceiling light.' },
      { title: 'Balance with a quiet floor', body: 'Pair a busy wall with a calm, pale floor.' },
    ],
    finishes: ['walnut', 'limestone'],
    collections: ['wall-panels', 'tiles'],
  },
]

export const findScene = (slug: string | undefined) => SCENES.find(scene => scene.slug === slug)
export const findFinish = (id: Finish['id']) => FINISHES.find(finish => finish.id === id)!
