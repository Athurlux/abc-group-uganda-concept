# ABC Group Uganda: independent redesign concept

A proposed digital showroom for [ABC Group Uganda](https://abcgroupuganda.com/), the Kampala supplier of tiles, sanitaryware, wall panels, kitchen sinks and installation materials. It was built by Arthur Kitandwe to pitch website design and development services, and is **not affiliated with, commissioned or approved by ABC**.

**Live:** https://abc-group-uganda-redesign.pages.dev (noindex)
**Proposed direction:** “Materials that make the space.” ABC’s published red logo is used unchanged.

## The journey

Explore collections → inspect an item → save selections → review the project shortlist → complete a demo quote request.

| Route | What it does |
|---|---|
| `/` | Hero, collection navigation, the material-to-room moment, featured selections, how the shortlist works, inspiration rooms, showrooms, professional support, closing CTA |
| `/collections` | Collection index and a searchable catalogue: search, collection and image-type filters, sorting, removable chips, reset and counts, all in the URL |
| `/collections/:slug`, `/collections/:slug/:item` | What ABC lists for each range (attributed); item pages with known facts, “Details to be confirmed”, the published-label note, add to shortlist, request details, related items |
| `/shortlist` | The shared project shortlist: piece counts where established, “Quantity to confirm” otherwise, remove, clear with undo |
| `/quote` → `/quote/confirmation/:ref` | Selections → project → contact preferences → review and edit → demo confirmation, with print and an honest fallback after a refresh |
| `/inspiration`, `/inspiration/:slug` | Four generated, fictional rooms, illustrative finishes and “Explore related collections” |
| `/showrooms`, `/showrooms/:slug`, `/showrooms/visit` | The four published showrooms (the warehouse shown separately), a preferred-showroom setting and a demo visit request using Kampala dates |
| `/professionals` | A demo project brief for architects, designers, contractors and developers |
| `/about`, `/contact` | Supported facts and the concept disclosure; published contact details kept apart from the demo form |
| `*` | A useful not-found page, also used for unknown items, rooms and showrooms |

**Nothing is sent anywhere.** Form answers live in React memory only. The shortlist store saves catalogue IDs, piece counts and a preferred showroom to `localStorage` (versioned and read defensively), and nothing personal.

## Stack

React 19, TypeScript, Vite 7, React Router 7 (lazy route chunks), GSAP with ScrollTrigger (loaded only by pages that animate), plain CSS custom properties, and DM Sans variable (OFL, self-hosted via Fontsource). No backend, and no third-party requests at runtime.

- Data: `src/data/`, covering catalogue, collections, inspiration, locations and dated site facts
- Shortlist: `src/lib/shortlist.ts`, pure merge/remove/quantity/recovery functions plus a `useSyncExternalStore` store
- Filters: `src/lib/catalogueFilters.ts`; visit dates: `src/lib/schedule.ts`
- Forms: one declarative engine (`src/forms/engine.ts`), journeys in `src/forms/flows.ts`
- Motion: `src/animation/useSiteMotion.ts`, one scoped `useGSAP` context per page with `matchMedia` and a static reduced-motion path

## Commands

```bash
npm install
npm run dev                          # local development
npm test                             # unit tests (vitest)
npm run build                        # type-check and production build
npm run preview -- --port 4177
MSYS_NO_PATHCONV=1 npm run verify    # browser journeys against the preview (Chrome); drop the prefix outside Git Bash
npm run images                       # regenerate web images from assets-src/original (Python + Pillow)
```

`node scripts/shoot.mjs <outDir> <width> <paths...>` captures full-page screenshots. Set `SEED` to preload a shortlist.

## Deployment

Cloudflare Pages, **Direct Upload**, project `abc-group-uganda-redesign`. **A GitHub push does not deploy.** To publish an update:

```bash
npm test && npm run build
npm run preview -- --port 4177          # in another terminal
MSYS_NO_PATHCONV=1 npm run verify
npm run deploy
MSYS_NO_PATHCONV=1 VERIFY_URL=https://abc-group-uganda-redesign.pages.dev npm run verify
```

`public/_redirects` serves `index.html` for every path, so nested routes survive a refresh. `public/_headers` adds `X-Robots-Tag: noindex`, caching and basic security headers.

## Documentation

- [PITCH-NOTES.md](PITCH-NOTES.md): what the concept improves and what a real launch would need
- [docs/ASSETS.md](docs/ASSETS.md): provenance, generated versus source images, label discrepancies
- [docs/CONTENT-NOTES.md](docs/CONTENT-NOTES.md): sources, unverified fields, locations, claims left out
- [docs/VERIFICATION.md](docs/VERIFICATION.md): checks actually performed and remaining limitations

Concept design & development by [Arthur Kitandwe](https://arthur-kitandwe.kranks533.workers.dev/).
