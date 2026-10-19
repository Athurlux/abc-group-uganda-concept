# Verification

Checks actually performed on 19 October 2026. Anything under “Not performed” was not done.

## Asset pack

68 files extracted. 67 of 67 SHA-256 checksums in `asset-manifest.json` matched, and 47 of 47 raster images decoded with Pillow. Every image was inspected through the contact sheets, and the disputed ones at full size. That inspection found one discrepancy the pack missed: `kitchensinks-01` has two bowls, not one. See `docs/ASSETS.md`.

## Automated

| Check | Result |
|---|---|
| `tsc -b` (strict, no unused locals) | Clean |
| `npm run build` | Clean. Route chunks are lazy; GSAP (about 46 KB gzipped) loads only with pages that animate |
| `npm test` (vitest, 19 tests) | All pass. Covers shortlist add, merge, cap, removal and quantity rules; storage round-trip and recovery from malformed, outdated or tampered data (including duplicate IDs and a warehouse “showroom”); quantity labels without mixed units; piece units only for discrete products; conservative catalogue names; search, filters, sort and URL parsing; Kampala visit dates (past, today, after Kampala midnight, upper bound, impossible dates); conditional fields and pruning; contact rules; every sample completing its flow; step-skipping protection |
| `npm run verify` (one headless Chrome, 57 checks) | 57/57 on the local preview, then 57/57 on https://abc-group-uganda-redesign.pages.dev |
| Small-phone journey (360 × 740, touch, live site) | Saved two items, opened the drawer, completed the quote with sample details, no horizontal overflow at review, 68px final button, confirmation shown, no runtime errors |
| Live URL checks (curl) | Nested routes return the app; logo, Open Graph image and hero assets served; `X-Robots-Tag: noindex, nofollow` and the robots meta present |

### What `scripts/verify.mjs` covers

- **Catalogue:** search in the URL, conflicting filters showing an empty state, Back undoing a filter, removing a chip, the image-type filter, reset.
- **Items and shortlist:** item detail with “Details to be confirmed” and no price; the published-label note; adding, feedback and the header counter; a repeat add merging into one entry; an application reference kept as “quantity to confirm”.
- **Drawer:** focus moves inside, Escape closes it and returns focus.
- **Shortlist page:** refresh persistence, quantity changes, exact storage contents (IDs, counts, showroom only), clear and undo.
- **Quote:** the preferred showroom carrying into the form and surviving “Use sample details”; error summary and focus; the conditional organisation field; editing from review; double-click completion; the confirmation wording, summaries and print; Back not resubmitting; the refreshed-confirmation fallback.
- **Visit:** showroom preselected from a link; past dates and today rejected in Kampala time; completion without booking.
- **Brief and contact:** the project brief; contact with a product question pre-written from “Request product details”; real contact details kept apart from the form.
- **Recovery and routes:** corrupt storage recovering to an empty shortlist; direct loads of nested routes and fallbacks; the wrong-collection redirect.
- **Keyboard and motion:** mobile menu focus and Escape; reduced motion giving a settled hero and a static material story.
- **Motion cleanup:** ScrollTrigger count unchanged after repeated navigation and resizing (30 → 30).
- **Layout:** no horizontal overflow on 9 routes at 360, 390, 768, 1024 and 1440 px.
- **Privacy and health:** no non-GET or third-party requests, no personal data in URLs or browser storage, no failed requests, no console errors.

## Bugs found and fixed during verification

- **Undo after clearing never appeared.** Clearing unmounted the control that held the undo state. The snapshot now lives in the shortlist store (in memory only).
- **The closed drawer kept a hidden second copy of the shortlist** in the DOM. It now renders only while open.
- **“Use sample details” replaced every field,** which would overwrite a carried showroom or a pre-written product question. It now fills only empty fields.
- **An awkward generated error message,** “Enter describe the project type.”, was reworded.
- **The material-to-room swatch was mispositioned** in scrub mode; it is now a centred square that grows to cover the frame.
- **Breadcrumbs showed list numbers.**

## Visual review

Screenshots were captured and inspected:

- 1440 px: home (full page and fold), the material-to-room scrub at three points, collections, item detail, shortlist, an inspiration room, showrooms.
- 390 px: home, collections, item detail, quote.

Blank areas in some very tall full-page captures were capture artefacts; the same sections rendered correctly in viewport screenshots. Selected images are in `docs/screenshots/`.

## Not performed

- No Lighthouse or automated accessibility audit.
- No screen-reader pass.
- No physical-device testing; phones were emulated in desktop Chrome.
- No Safari or Firefox testing.
- No throttled-CPU performance profile.

## Remaining limitations

- Product details are unknown by design. Catalogue images are a small sample of ABC’s range.
- Opening hours, per-showroom ranges and the founding year are unresolved.
- Deployment is Direct Upload: a GitHub push does not update the live site (see README).
