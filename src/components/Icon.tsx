const paths = {
  // From the asset pack's icons/ folder (24px grid, stroked, currentColor).
  bath: 'M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM5 12V5a2 2 0 0 1 4 0M6 20v2M18 20v2',
  collections: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  material: 'M3 8l9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5',
  measure: 'M3 8h18v8H3zM7 8v4M11 8v3M15 8v4M19 8v3',
  professional: 'M4 7h16v14H4zM8 7V3h8v4M4 12h16M10 12v3h4v-3',
  quote: 'M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h6',
  shortlist: 'M6 3h12v18l-6-4-6 4z',
  showroom: 'M3 10l9-7 9 7M5 9v12h14V9M9 21v-7h6v7',
  // Interface glyphs.
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  back: 'M19 12H5m5-5-5 5 5 5',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
  search: 'm20 20-4.2-4.2M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z',
  pin: 'M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 1 1 13 0c0 5.2-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  )
}
