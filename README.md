# SD Projects social templates

InDesign templates for SD Projects social posts. There is one file per programme: Kelpcrete, Reading Room, Building and Events. Each file holds ready-made layouts called Start here pages.

You can work in InDesign yourself, or ask an AI agent to do it. Both follow the same rules.

## Make a post

1. Open the programme file in `indesign/`.
2. Save a copy. The copy is used only for this post.
3. Name it after the post and save it in `content/<date>-<post-name>/`, for example `content/2026-11-12-kelpcrete-launch/post.indd`.
4. In the copy, look at the Start here pages.
5. Keep the pages you need and delete the rest. Delete the last page too (the swatch reference). Swap the text and the images. Never edit styles or parents. If you need two posts with the same layout, duplicate that page.
6. Export a JPEG (posts) or a transparent PNG (overlays) into the same folder.

The programme files are locked. They open read-only, so you can only save a copy. This protects the templates.

More detail: `docs/workflow.md`.

## Using an AI agent

Paste `START-HERE-PROMPT.md` into a strong AI model the first time. It sets up how the agent works with InDesign and runs a test post. After that, the agent reads `AGENTS.md` and `docs/agent-setup.md` and skips setup.

## Folder map

| Path | What it is |
|---|---|
| `AGENTS.md` | Rules for AI agents. |
| `START-HERE-PROMPT.md` | First-time prompt for an AI agent. |
| `GLOSSARY.md` | Names used in this project (Programme, Format, Treatment, Layout ...). |
| `docs/` | Workflow, template spec, InDesign connection options, maintenance notes. |
| `indesign/` | The locked template files and their `links/`. Do not edit. |
| `content/` | Your posts. One folder per post. |
| `brand/` | Colour guide, design brief, palette files, swatches. |
| `source-images/` | Original photos to pick from. |
| `tools/` | Build scripts. For the designer only. |
| `archive/` | Old work and the template backup. |

## If a template gets damaged

Restore `indesign/` from `archive/templates-backup-2026-11-06.zip`, then lock the files again (see `docs/maintaining.md`).
