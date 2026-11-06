# 0001. Four Programme files tied by an InDesign Book

## Context
Marketing needs InDesign templates for four Programmes (Kelpcrete, Reading Room, Building, Events) that share one type system, grid and layout set but differ in colour and a few Programme-only layouts. A single file would mix four palettes and make Start here pages unmanageable. Four unrelated files would drift.

## Decision
- One Source file (`SD-Social-Source.indd`) holds styles, object styles, role swatches (Events values as placeholders) and the shared parents.
- Four Programme files are copies of the Source, each with its own role swatch values, 11-step family plus Neutral, Programme-only parents and Start here pages.
- `SD-Social.indb` ties the five files; the Source is the style source. Synchronize pushes paragraph, character and object styles and parent pages.

## Consequences
- A style or shared-layout change is made once in the Source and pushed with Book > Synchronize.
- Observed in InDesign 21.6: Synchronize overwrites role swatch values with the Source placeholders even with Swatches unticked (styles reference them by name). After every sync run `S.fixRoles()` from `tools/build_indesign.jsx` to restore each Programme's colours.
- Programme-only parents use prefix `Q` so they never collide with synced parents.
- Marketing opens only a Programme file, never the Source.
