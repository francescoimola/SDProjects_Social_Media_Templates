# Maintaining the templates

For the designer. Marketing and agents do not need this file.

## Files and locks
The five `.indd` files and `SD-Social.indb` in `indesign/` are Finder-locked (`uchg` flag). They open read-only, so users can only save a copy.

Unlock before editing:
```
chflags nouchg indesign/*.indd indesign/SD-Social.indb
```
Lock again when done:
```
chflags uchg indesign/*.indd indesign/SD-Social.indb
```
Back up first: zip `indesign/` into `archive/templates-backup-<date>.zip`. Close all documents and the Book in InDesign before zipping.

## Edit the Source
1. Unlock the files.
2. Edit styles or shared parents in `SD-Social-Source.indd`. Save and close.
3. Open `SD-Social.indb` and Synchronize. The Source is the style source. Tick styles, object styles and parents. Leave swatches off.
4. Sync overwrites the role swatch values with the Source placeholders. Run `S.fixRoles()` from `tools/build_indesign.jsx` to restore each programme's colours.
5. Check one Start here page per programme for colour, then lock the files again.

Decision record: `docs/adr/0001-four-programme-files-book-sync.md`. Spec: `docs/template-spec.md`.

## Rebuild from scratch
`tools/build_indesign.jsx` and `tools/figma_layouts.json` build everything. Colours come from `brand/color-palette-strom-refined.json`. The script finds the repo root from its own location.

Run one stage at a time through an InDesign scripting bridge:
```
$.evalFile(File("/path/to/repo/tools/build_indesign.jsx")); S.src1();
```
Use the function-in-an-IIFE pattern; results of bare expressions are unreliable. Images come from `indesign/links/`.

Swatch files are made with:
```
python3 tools/make_swatches.py brand/color-palette-strom-refined.json brand/swatches/
```

## Gotchas
- Modal dialogs hang the scripting bridge. Set the interaction level to never interact.
- JPEG export from script needs `jpegExportRange = EXPORT_RANGE` and `pageString = "+N"`. Page names restart after each format section.
- After a scripted Save As, the old document handle is invalid. Use the active document.
- Do not move or rename `indesign/links/`. The programme files link to it.
