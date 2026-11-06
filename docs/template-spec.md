# SD Projects social templates: InDesign spec

Files live in `indesign/`: `SD-Social-Source.indd` (styles only, never opened by marketing), `SD-Social-Kelpcrete.indd`, `-Reading-Room.indd`, `-Building.indd`, `-Events.indd`, and the Book `SD-Social.indb`. Vocabulary: see `../GLOSSARY.md`. Rebuild and maintenance: see `maintaining.md`.

## Formats and grid
| Format | Size | Columns | Rows |
|---|---|---|---|
| 4:5 | 1080x1350 | 6 x 156 | 6 x 200, bottom margin 38 |
| 9:16 | 1080x1920 | 6 x 156 | 12 x 140 |
| 16:9 | 1920x1080 | 12 x 140 | 6 x 156 |

Margins 32, gutter 16, px units, no bleed. Baseline grid 4 px starting 32 from page top. Text frames use First Baseline Offset: Cap Height. Sections split by format.

## Type (Archivo, metrics kerning, flush left, balance ragged lines, align to baseline grid)
| Style | Font | Size/leading | Tracking |
|---|---|---|---|
| Display (+ centred) | Bold | 252/200 | -60 |
| Headline (+ centred) | Bold | 96/88 | -50 |
| Cover question | Bold | 128/116 | -50 |
| Statement | Regular | 60/60 | -30 |
| Statement Bold | Bold | 60/60 | -50 |
| Body | Regular | 36/36 | -30 |
| Body Bold | Bold | 36/36 | -30 |
| Micro | Regular | 28/28 | -30 |

Groups: On Hero, On Light (based on Hero, colour only), On Overlay, On Accent (Light accent text), On Artwork (Hero colour, for Difference-blend text). Character styles: Bold, Italic. Headline has 96 space before so two-paragraph blocks match Figma.

## Role swatches (names fixed, values per Programme)
| Role | Kelpcrete | Reading Room | Building | Events |
|---|---|---|---|---|
| Hero | 400 #FF5F00 | 300 #28D5C8 | 700 #2F4D86 | 950 #101113 |
| Hero ink | 950 #27150F | 950 #0E1E1C | 050 #F3F5F9 | Neutral 050 #F5F3EB |
| Light | 050 #FAF3F1 | 050 #EDF8F6 | 050 #F3F5F9 | Neutral 050 #F5F3EB |
| Light ink | 950 #27150F | 800 #134640 | 800 #283D62 | 950 #101113 |
| Light accent | 500 #DB4F00 | 800 #134640 | 800 #283D62 | 950 #101113 |
| Overlay panel | 950 #27150F | 300 #28D5C8 | 700 #2F4D86 | 950 #101113 |
| Overlay ink | 400 #FF5F00 | 950 #0E1E1C | 050 #F3F5F9 | Events 050 #F5F5F6 |

Each file also has its 11-step family and Neutral (e.g. `Kelpcrete 400`) and a Reference page (last page, do not export).

## Parents
Structural (grid, guides) > Treatment (Hero / Light background) > Layout, e.g. `Hero / Split editorial 4:5`. Overlay layouts sit directly on the structural parent. Programme-only parents (prefix Q): Text + motif row, Oversized word + photo artwork, Artwork over caption, Events agendas. The hidden Guides layer holds Reel UI zones on 9:16.

## Book sync
See `maintaining.md`.

## Export
- Posts: JPEG, sRGB, 1080 px wide (Export > JPEG, page range, 72 ppi; see `workflow.md`).
- Overlays: PNG, transparent background. Preview and Guides layers are non-printing so they are excluded.

## Making a post
See `workflow.md`.
