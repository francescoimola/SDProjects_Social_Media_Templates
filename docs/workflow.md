# Workflow: making a post

Same six steps for a person and for an agent.

## 1. Open the programme file
Pick the programme: `indesign/SD-Social-Kelpcrete.indd`, `-Reading-Room.indd`, `-Building.indd` or `-Events.indd`. The file opens read-only because it is locked. InDesign may warn about this. That is expected.

## 2. Save a copy
File > Save As. Never use plain Save. The copy is for this one post.

## 3. Name and place it
Make a folder `content/<date>-<post-name>/` and save the copy as `post.indd` inside it.
- Date as `YYYY-MM-DD`.
- Post name in lowercase with hyphens, for example `2026-11-12-kelpcrete-launch`.
- After saving, check the title bar or File > Save As path. It must be inside `content/`.

## 4. Look at the Start here pages
Open the Pages panel. Pages come in groups by format: 4:5 (1080×1350), 9:16 (1080×1920), 16:9 (1920×1080). The parent name of each page shows its layout, for example `Hero / Split editorial 4:5`. Layouts are listed in `template-spec.md`.

## 5. Keep, delete, swap
- Keep the pages you need. Delete the rest.
- Delete the last page too. It is the swatch reference, not a post.
- Type over the sample text. Keep the paragraph style that is already applied.
- Replace images with File > Place, ticking Replace Selected Item. Pick photos from `source-images/` or your own.
- Need two posts with the same layout? Duplicate that page.
- Never edit styles, parents, swatches or the grid.

Check each page:
- No red overset marker on any text frame.
- Fonts: Archivo is installed.
- Links panel: no missing or modified links.

## 6. Export
Export into the same folder as `post.indd`.

| Kind | Format | Settings |
|---|---|---|
| Post | JPEG | sRGB, 72 ppi, quality High. Output must be 1080 px wide (1920 for 16:9). |
| Overlay | PNG | Transparent background. Preview and Guides layers do not export. |

Export a page range, not the whole document, if the file holds several posts. Name files after the post, for example `kelpcrete-launch-01.jpg`.

Check the pixel size of the first export: 4:5 = 1080×1350, 9:16 = 1080×1920, 16:9 = 1920×1080.

## Agent notes
- After Save As in a script, the old document handle is invalid. Use the active document.
- Page names restart after each format section. Export with page indexes (`pageString = "+N"` for the Nth page), not page names.
- Modal dialogs freeze script bridges. Set the interaction level to never interact while scripting.
