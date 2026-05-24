# Figma Inspiration Reference

Figma is connected through the MCP integration and the current document was inspected on May 23, 2026.

## Source

- Page: `Page 1`
- Primary inspiration frame: `Home-1`
- Primary frame node ID: `37:2`
- Frame size: 1920 x 9464.03
- Variables found: none

## Important Connection Note

The Figma connection can read metadata and screenshots successfully.

Full design-context asset export is currently blocked because Figma Dev Mode has not allowed this repo as an asset-write target. To allow future image/vector exports, add this directory in Figma Dev Mode MCP settings under Allowed directories:

`C:\Users\DELL\Documents\GitHub\BelleFull\src\assets\figma-inspiration`

## Visual Direction Observed

- Restaurant landing page with a premium editorial food style.
- Strong food photography, especially hero and menu imagery.
- Mostly light background with black, red/pink, yellow/gold, and warm accent colors.
- Bold serif-style display headings paired with cleaner sans-serif body/navigation text.
- Section rhythm alternates between white and very light cool-gray backgrounds.
- Frequent use of rounded cards, bordered image tiles, small product badges, and price chips.
- Visual energy comes from food photography, editorial typography, menu cards, and selective bright accent panels.

## Main Sections In The Inspiration

- Header and navigation
- Hero with food photography, headline, menu CTA, and video/play affordance
- Weekly special card overlay
- About restaurant intro
- Three experience cards: Restaurant, Cocktail Bar, Private Dining
- Food category selector
- Menu feature panel
- Discover menu heading
- Promotional menu banners
- Featured dishes/product cards
- Customer feedback section
- Expert/chef profiles
- Mobile ordering/app promotion
- Recent news/blog cards
- Instagram/follow grid
- Footer with brand/contact/navigation columns

## Rebuild Guidance

Use this Figma frame as visual inspiration, not as a direct content source. The current restaurant content source is `docs/amazing-taste-details.md`; the older Belle Restaurant notes in `docs/project-details.md` remain archived only as the previous implementation record.

For the actual website rebuild:

- Reuse Amazing Taste Delicacies identity, menu data, copy, and assets from `src/data` and `src/constants`.
- Adapt the Figma visual language to Amazing Taste content instead of copying placeholder content like Farthings, Sicilian Pizza, or unrelated dollar pricing.
- Prefer a polished responsive React implementation with sections split under `src/sections`.
- Keep shared primitives under `src/components`.
- Keep brand/content data separate from section markup.
