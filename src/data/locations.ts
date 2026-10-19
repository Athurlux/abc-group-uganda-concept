// Locations as published on ABC's About page (rechecked 19 October 2026). No opening
// hours, coordinates or per-location ranges are published, so none are shown.
// Directions links search for the published address; they are not pinned locations.

export interface Location {
  slug: string
  name: string
  kind: 'showroom' | 'warehouse'
  address: string
  phone: string
  phoneDisplay: string
  /** Exterior photograph from ABC's About page, where one exists for this location. */
  photo: string | null
  photoAlt: string
}

export const LOCATIONS: Location[] = [
  {
    slug: 'stiles-and-bathz',
    name: 'ABC Stiles & Bathz',
    kind: 'showroom',
    address: 'JR Complex, Showroom 3, Plot 101, next to New Vision, Jinja Road, Kampala',
    phone: '+256708080888',
    phoneDisplay: '0708 080 888',
    photo: 'about-us-01',
    photoAlt: 'Exterior of the ABC Stiles & Bathz showroom on Jinja Road, as published on ABC’s website.',
  },
  {
    slug: 'hauz',
    name: 'ABC Hauz',
    kind: 'showroom',
    address: 'Plot 49–53, 55 Fifth Street, Industrial Area, Kampala',
    phone: '+256752383168',
    phoneDisplay: '0752 383 168',
    photo: 'about-us-02',
    photoAlt: 'Exterior of the ABC Hauz building in Industrial Area, as published on ABC’s website.',
  },
  {
    slug: 'ceramic',
    name: 'ABC Ceramic',
    kind: 'showroom',
    address: 'Plot 78–84, Sixth Street, Industrial Area, Kampala',
    phone: '+256744970000',
    phoneDisplay: '0744 970 000',
    photo: 'about-us-03',
    photoAlt: 'Exterior of the ABC Ceramics building in Industrial Area, as published on ABC’s website.',
  },
  {
    slug: 'casa-ceramica',
    name: 'Casa Ceramica',
    kind: 'showroom',
    address: 'Chinese Business Hotel Building, Plot 33 Fifth Street, Kampala',
    phone: '+256744970000',
    phoneDisplay: '0744 970 000',
    photo: null,
    photoAlt: '',
  },
  {
    slug: 'warehouse',
    name: 'ABC WareHouse',
    kind: 'warehouse',
    address: 'Plot M875B, Channel Lane, off Old Port Bell Road, Wakonko, Kampala',
    phone: '+256744554466',
    phoneDisplay: '0744 554 466',
    photo: null,
    photoAlt: '',
  },
]

export const SHOWROOMS = LOCATIONS.filter(location => location.kind === 'showroom')
export const findLocation = (slug: string | null | undefined) => LOCATIONS.find(location => location.slug === slug)
export const findShowroom = (slug: string | null | undefined) => SHOWROOMS.find(location => location.slug === slug)
export const directionsUrl = (location: Location) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name}, ${location.address}`)}`
