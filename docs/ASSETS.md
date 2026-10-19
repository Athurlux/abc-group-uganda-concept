# Assets

Source: `ABC_Group_Uganda_Agent_Asset_Pack.zip` (68 files under `ABC_Group_Uganda_Master_Assets/`), kept unchanged in `assets-src/original/`. On 19 October 2026 all 67 SHA-256 checksums in `asset-manifest.json` matched their files, and all 47 raster images decoded with Pillow.

## Two kinds of imagery

| Kind | Files | How the site treats them |
|---|---|---|
| **Generated inspiration** (AI) | `inspiration/master/*`: hero desktop and mobile, bathroom, kitchen, living-room flooring, wall panels, material board, fittings detail, four textures | Labelled as generated, fictional and not ABC projects. Never placed under a real project name. Textures carry “Illustrative finish — not a stocked product”. Linked onwards only with “Explore related collections”. |
| **Company-site references** | `authentic/web/*`: logo, 12 product, packaging and application images, three showroom exteriors | Bytes as published on abcgroupuganda.com (URLs in `authentic/source-register.json`). Not proof of SKU, brand, finish or licence. Used with conservative names and “to be confirmed” details. |

`fittings-detail.webp` is held in reserve and not displayed: a generic gold mixer beside the real gold-toned mixer photo could be mistaken for a product.

## Logo

ABC’s published logo (`abc-official-logo.webp`, 292 × 149, transparent) is used **unchanged** in the header (34px tall), the footer (40px, on an off-white plate for contrast on charcoal) and nowhere larger. No higher-resolution or vector original was found from an authoritative source, so none is claimed. The favicon is the pack’s neutral concept mark, not an ABC mark.

## Label discrepancies and conservative names

| ID | Published label (kept) | What the image shows | Display name |
|---|---|---|---|
| sanitaryware-01 | Concealed tank toilet sanitaryware | White square wall-hung pan | White wall-hung toilet |
| sanitaryware-02 | Rectangular basin | Pedestal basin, rounded bowl | White pedestal basin |
| sanitaryware-03 | Chrome Faucet | Gold-toned single-lever mixer | Single-lever basin mixer (finish to be confirmed) |
| sanitaryware-04 | Oval bathtub | Rectangular bath with clear side panel | Rectangular bath with clear side panel |
| kitchensinks-01 | Best kitchen sink for modern homes (pack starter: “single-bowl”) | **Two** bowls, pull-down mixer | Two-bowl sink with pull-down mixer |
| kitchensinks-02 | Premium double bowl kitchen sink | Multi-compartment workstation sink with insert, rinser, side tap | Multi-compartment workstation sink |
| concealed-cistern-01 | concealed cistern for toilet | Geberit **logo** only | Not a catalogue item |
| concealed-cistern-02 | Geberit Concealed toilet | Geberit-marked in-wall frame | Geberit-marked concealed cistern frame |
| grout-adhesive-01 | Bathroom best waterproof | Grout pail; much of the lettering is garbled | Grout pail (packaging image) |
| grout-adhesive-02 | Fast-setting best adhesive | MYK Laticrete-marked adhesive bag; partly garbled text | Tile adhesive bag (packaging image) |
| tiles-01 / tiles-02 | 3D-effect / Rustic effect tiles | Bathroom and office **application scenes** | Labelled “Application photo”, not tile samples |
| vox-panels-01 / 02 | gypsum ceiling design | Wood-tone slatted panels on a balcony and terrace | Labelled “Application photo”; material not identified |

The two packaging images contain garbled lettering, which suggests they are generated or edited illustrations rather than photographs. Their printed text (product names, “20 kg”, grades) is therefore not used as product information.

Three showroom exteriors show sale signage (for example “MEGA SALE”, “40%”). It is captioned as historical and never used as offer copy. Casa Ceramica has no published photo, and none is borrowed from another location.

## Derivatives

`npm run images` (`scripts/optimize-images.py`) builds WebP derivatives from the largest supplied file and never upscales:

- generated scenes: 480/960/1536
- textures: 240/640/1254
- references: a card size plus the source width
- heroes: a desktop pair and a mobile pair, the mobile one cropped to drop empty wall above the copy

Total about 3.9 MB across all sizes. Only the active hero is preloaded, on the homepage only, with a `media` query per device. Everything else is lazy-loaded with declared dimensions, and the large texture size loads only on desktop.

Also included: the eight pack icons, inlined in `src/components/Icon.tsx` and styled with `currentColor`; `social/social-preview.jpg` as the Open Graph image (it carries “Independent redesign concept”); and DM Sans variable, OFL, self-hosted.

## Rights

Brand and image rights remain with their owners. These images are used for a clearly labelled proposal only; an official site would need ABC’s confirmation of rights for every image and brand mark.
