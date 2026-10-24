# RAIL v2 — art assets (self-generated)

All eight images in this folder are **generated locally** by the scripts in
`rail-app/scripts/art/`. No stock photography, no image-generation API, no
external image files: every pixel is produced procedurally (numpy + Pillow) or
by rendering hand-written HTML/CSS in headless Chrome.

- **License:** original work created for this repository by the RAIL team.
  No third-party imagery, no attribution requirements, no stock licenses.
  (Webfonts are used only *at render time* for the share card: Pretendard,
  Instrument Serif, IBM Plex Mono — all OFL.)
- **Deterministic:** every generator uses fixed seeds and no clocks/random
  state, so re-running reproduces the same files (verified byte-identical).
- **No banding:** dark assets are shaded in linear light, tone-mapped with a
  soft filmic rolloff, and finished with grain + triangular dither before the
  WebP encode.

## Files

| File | Size | Dimensions | Used for | Generator |
|---|---:|---|---|---|
| `hero-rail.webp` | 98 KB | 2400×1500 | Hero background (DESIGN-V2 §3). Left third is kept quiet for cream H1; rails + ignition live on the right. | `gen_art.py --target hero-rail` |
| `passport-chrome.webp` | 61 KB | 1600×1200 | Chrome/metal foil sheet behind the passport card, and as the card border crop (§4-03). | `gen_art.py --target passport-chrome` |
| `orange-band.webp` | 17 KB | 2400×1200 | Problem section full-bleed orange field (§4-01), underlying a `#FF4B1F` overlay. Flat mid-tone so ink type stays readable. | `gen_art.py --target orange-band` |
| `chrome-ribbon.webp` | 108 KB | 2000×1200 | RWA rail band background (§4-04), dark with liquid chrome ribbons and a bottom fade. | `gen_art.py --target chrome-ribbon` |
| `halftone-grid.webp` | 162 KB | 1600×1600 | RGBA halftone dot screen overlay (dark "Night Terminal" and cream bands). | `gen_art.py --target halftone-grid` |
| `grain.png` | 382 KB | 512×512 | Seamless film-grain tile with alpha; overlay use. | `gen_art.py --target grain` |
| `agents-scan.webp` | 12 KB | 1600×1000 | Scanline / telemetry texture, very low contrast (market + agents sections). | `gen_art.py --target agents-scan` |
| `og-v2.png` | 472 KB | 1200×630 | Share card. Typography rendered by Chrome; figures injected from the engine. | `og_v2.mjs` |

## Regenerate

From `rail-app/`:

```bash
# 1) raster assets (numpy + Pillow)
"C:\Users\User\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" scripts/art/gen_art.py
#    … or with python on PATH:
python scripts/art/gen_art.py

# one asset / a subset / everything
python scripts/art/gen_art.py --target hero-rail
python scripts/art/gen_art.py --target orange-band chrome-ribbon
python scripts/art/gen_art.py --target all
python scripts/art/gen_art.py --list

# 2) share card: engine numbers -> JSON, then HTML -> Chrome -> 1200x630 PNG
npx tsx scripts/art/og_figures.ts      # lib/engine.ts -> scripts/art/og_figures.json
node scripts/art/og_v2.mjs             # -> public/art/og-v2.png
```

`gen_art.py` also accepts the short names `hero`, `passport`, `band`, `ribbon`,
`halftone`, `scan`, and the literal file names. The repo's art MCP server
(`mcp/art-server.mjs`) calls the same CLI via `regenerate_art` / `regenerate_og`.

Expected runtime: full raster set ≈ 2.5 min (hero alone ≈ 60 s).

## What each asset is / how it is made

- **hero-rail** — a night scene shaded in linear light. Eight chrome "rails"
  are drawn as perspective wedges converging on a vanishing point at
  `(0.735W, 0.475H)`; the half-width grows linearly with screen distance
  (`k·p`), so they read as receding rail. Each wedge gets a cross-section
  *reflection ladder* (cool edge rim → cold face → core shadow → lit warm face →
  hot specular → ignition rim), a smooth longitudinal brush from interpolated
  1-D noise, fog toward the vanishing point, and a left-side fade so the rails
  "leave the light". The ignition is a hot core + tight halo + very soft
  anamorphic wash; the whole thing is bloomed with two blurred luminance passes.
- **passport-chrome** — a deep ink-green sheet shaded by a reflection ladder
  along a `0.34u + 0.66v` axis (two softbox strips, a lower glint, one dark
  separation), plus two crossing families of guilloche lines and a concentric
  "security rose", embossed (bright line + soft shadow). A soft tonal fold runs
  diagonally across the foil; the lower-right picks up an ignition rim.
- **orange-band** — an ember→signal diagonal mesh, one very low-frequency value
  field (±7 %), a blurred diagonal chrome sheen and a right-edge reflection
  wash. Deliberately flat: no high-frequency contrast, so ink type on top keeps
  WCAG AA at every pixel (measured below).
- **chrome-ribbon** — three ribbons. Each is a smooth warped band; the shading
  is a reflection ladder across the band (cool broad reflection, cool horizon
  line, warm key reflection, dark valley) that is warp-and-twist-modulated along
  the strand, so the highlights flow like liquid metal. A rounded-tube `form`
  term rolls the edges away and rims are lit warm on the lower edge.
- **halftone-grid** — rotated (27°) dot screen, dot radius modulated by a slow
  field and masked toward the lower-left, with a finer offset second screen.
  Cream dots, alpha quantised in 18-step buckets so the file stays small.
- **grain** — two clump scales from periodic spectral noise + per-pixel white
  noise on a mid-grey carrier. RGB carries the grain value, alpha the deviation
  from neutral: light *and* dark specks land on the composite, and neutral areas
  stay transparent. White noise + tileable spectral noise = seamless.
- **agents-scan** — ink base, two mixed scanline periods (3 px / 7 px, so
  downscaling can't moiré), faint 64 px grid, 24 px dot matrix, sparse data
  hairlines, two telemetry spike clusters, acid/orange panel glows.
- **og-v2** — `og_v2.html` is a 1200×630 design using `hero-rail.webp` as a
  photographic bed, with a chrome-bordered passport artifact. Chrome renders it
  at 2× (2400×1260) so glyphs are supersampled, `sharp` downscales to 1200×630.
  All card figures are injected from `og_figures.json`, which is generated from
  `lib/engine.ts` — no number on the card is typed by hand.

## Measured QA (printed by the generators)

| Check | Value |
|---|---|
| hero left third (text safety) | mean 0.015 · p50 0.008 · **p99 0.166** · max 0.386 (linear-ish sRGB luminance) |
| hero bottom-left corner | max 0.249 |
| orange band vs ink text | WCAG **5.32:1** (darkest 0.5 %) … **7.05:1** (brightest 0.5 %) |
| all raster files | < 500 KB each; `halftone-grid.webp` 162 KB < 200 KB |
| grain tile | seamless (periodic noise), re-run byte-identical |
| WebP quality | 84–86 (lossy), `method=6`; PNG for grain + share card |

## Serving notes

- Dark-section backgrounds: `background-image` + `ink` overlay for contrast
  (`rgba(7,9,8,.55–.75)`), bottom fade where the next band starts.
- Text is never set on an image without an overlay or gradient scrim
  (hero already provides a dark left third, but the §3 ink overlay is still used).
- `next/image` `priority` only for the hero; everything else lazy.
- Grain overlay:

  ```css
  .grain::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background-image: url("/art/grain.png");
    background-size: 512px 512px;
    opacity: .16;
    mix-blend-mode: overlay;
  }
  ```

- Halftone overlay: `background-image: url("/art/halftone-grid.webp")`,
  `background-size: 1600px`, `opacity: .10–.18`, `mix-blend-mode: screen`
  on dark bands (the dots are cream).
- Share card: `public/art/og-v2.png` is the source of truth; the app's
  `app/opengraph-image.png` is a copy of it — re-copy after re-rendering.
