# Workbench visual revision · 2026-10-15

## Current checkpoint · 2026-10-16

User priority: visual design and Rahoo assets. Device migration, 3D interactions and static subpaths are already manually verified by the user; do not spend this pass repeating that suite. Keep local delivery only.

Completed: graphite canvas, light industrial assembly nameplate, lime primary metric/action/selection, numbered equipment-panel rails, Rahoo halftone/diagonal stripes/barcode crops, clickable component annotations, refined metal platform with instanced fasteners. Existing local HarmonyOS Sans and Monocraft WOFF2 retained. User's converter project at `C:/Users/KaguraAyano/PycharmProjects/tff2woff2` located; font optimization deferred behind design priority.

Independent visual review found annotation contrast against dots and small viewer buttons; both fixed. Current visual evidence and scope: `design-evidence-2026-10-16.md`. No pending asset jobs or publishing actions.

---

Scope: retain the Silent Gear calculator; add an actual Three.js equipment inspector, local HarmonyOS Sans and Monocraft, decorative assets exported from rahoo.online, and a GitHub Pages build. Do not publish.

Baseline: `three` was installed but CanvasStage used only Canvas 2D. Four-corner panels and calculator behavior are retained. Existing baseline capture: desktop-first.png.

Art direction: dark metal / jade / warm copper; pixel gear remains the focal point; calibrated inspection rings and subtle topography add context without competing with controls.

Sources acquired: rahoo.online material generator, scale circle (180 segments, radius 300, length 12, major tick interval 15), HUD arc, topographic texture. Original exported SVGs retained under asset-sources; viewBox cropping and colors adapted under public/decor.

In progress: lead owns UI integration and verification; three_preview owns CanvasStage/gear-model; fonts_deployment owns local fonts, licenses and Pages instructions.

Verification planned: existing engine suite and browser suite adapted to WebGL; rotation/zoom/reset; texture changes; 32 gear types; desktop/mobile/laptop captures; context loss fallback; nested static-host path; build and asset audit.

## Completed

Real WebGL inspector, local fonts, rahoo SVG decorations, material icons and manual GitHub Pages workflow integrated. Engine 18/18, browser 13 passed with 2 duplicate static-path skips. No publishing. See final-evidence.md for current captures, diagnostics and limitations. No pending generation jobs. Remaining known tradeoff: full Chinese fonts and Three.js produce a 10.5MB static directory and a 1002KB JS chunk.
