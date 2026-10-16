# Decorative assets

Exported using the public material generator at https://rahoo.online/ on 2026-10-15, as requested by the project owner. No login or paid generation used.

- calibration-ring.svg — 刻度圆, 180 segments, radius 300, segment length 12, primary tick every 15 segments. Cropped via viewBox around the complete ring and recolored copper.
- hud-arc.svg — HUD 线条 default arc, cropped via viewBox to the visible line and recolored copper.
- topographic.svg — 等高线 default planar texture, recolored sage.

Original exports are retained in artifacts/asset-sources. These are generated geometric decorations, not screenshots of the site's interface. No broader license for the site's other assets is asserted.

## 2026-10-16 industrial interface pass

Three more assets were exported directly from the same generator:

- `rahoo-stripes.svg`: 常见图形 → //, tilt 30°, height 100, thickness 20, corner radius 0, horizontal gap 12, 8 repeats. Cropped from the 302×302 export to viewBox `0 101 302 100`; used in the assembly nameplate.
- `rahoo-halftone.svg`: 半调波点 → horizontal linear gradient, standard grid, spacing 24, maximum radius 8, minimum radius 0, angle 0°. Cropped to the top 480 pixels of the 2000×2000 export, discarding off-crop circles and recoloring to a neutral mineral tone. Used behind the inspection platform.
- `rahoo-barcode.svg`: 条形码, input `SILENT GEAR / ATM9`. Cropped to viewBox `10 5 440 40` around the generated bars, recolored charcoal. Decorative assembly label only; it does not encode the user's build.

Unmodified exports with matching filenames are retained under `artifacts/asset-sources/`. The original scale ring, HUD arc and contour texture are reused. All generated assets are local SVGs; no page screenshot is embedded in the application.
