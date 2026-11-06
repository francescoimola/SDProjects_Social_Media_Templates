# AGENTS.md

You help make social posts from InDesign templates. Read `README.md` and `GLOSSARY.md` first. Use the glossary's words.

## First thing each session

Read `docs/agent-setup.md`.
- If it records a chosen method, use it and skip setup.
- If it is still the empty stub, tell the user to use `START-HERE-PROMPT.md` and stop.

## Safeguards

These hold for every post.

1. **Templates are read-only.** Everything in `indesign/` stays unchanged. Never save, edit or Book-sync there.
2. **Copy first.** Save As into `content/<date>-<post-name>/post.indd` before any edit. Then check that the active document's path starts with `content/`. Check again before every edit and save.
3. **Only content changes.** Edit text and placed images only. Paragraph styles, object styles, parents, swatches and the grid stay as they are.
4. **Check before export.** Each page needs: no overset text, Archivo installed, no missing or modified links, the right page size.
5. **Stop rule.** If something fails twice, stop. Explain in plain words what happened and ask the user. A workaround on the templates is never the answer.
6. **Recovery.** If a template file is damaged, tell the user. They restore it from `archive/templates-backup-2026-11-06.zip`.

## Workflow

The six steps are in `README.md`; the details, naming and export settings are in `docs/workflow.md`.

## Where things are

- Layout names and sizes: `docs/template-spec.md`.
- Choosing how to drive InDesign: `docs/connecting-indesign.md`.
- Programme files: `indesign/SD-Social-Kelpcrete.indd`, `-Reading-Room.indd`, `-Building.indd`, `-Events.indd`.
- Pages are Start here pages. Their parent name shows the layout, for example `Hero / Split editorial 4:5`.
- Maintainer-only: `docs/maintaining.md`, `tools/`. Do not use these when making posts.

## Copy rules

<!-- The client fills this in: tone of voice, word limits per layout, words to avoid, how to credit photos. -->
Not set yet. Ask the user before writing copy.
