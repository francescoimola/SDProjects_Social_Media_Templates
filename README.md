# SD Projects social templates

**Private and proprietary:** 
InDesign templates for SD Projects social posts. For SD Projects use only. See `LICENSE`.

## How to create a new post/piece of content

1. Open the programme file in `indesign/`.
2. Save a copy. The copy is used only for this post.
3. Name it after the post you intent to create, and save it in `content/<date>-<post-name>/`, for example `content/2026-11-12-kelpcrete-launch/post.indd`.
4. Ensure you are now editing the new files you have just created rather than the master.
5. Browse through the template pages (not the masters)
5. Select the templates you want to use for this particular post and delete the rest. 
6. Delete the last page  (the swatch reference). 
7. Order the remainig templates, then repalce the copy and the images. Never edit styles or parents. If you need two posts with the same layout, select a page in your and duplicate it.
6. Export a JPEG (posts) or a transparent PNG (overlays) into the same folder.

The programme files are locked. They open read-only, so you can only save a copy. This protects the templates.

More detail: `docs/workflow.md`.

## Using an AI agent

Before you ask an AI agent to do anythig with your idnesign files, paste `START-HERE-PROMPT.md` into a strong agentic AI model. You only need to do this one. 

This prompt sets up how the agent works with InDesign and runs a test post. After that, the agent reads `AGENTS.md` and `docs/agent-setup.md` and does not need to be setup again. Smooth sailing from here, hopefully.

## To keep in mind

- After cloning, the templates open unlocked. Lock them again as described in `docs/maintaining.md`.
- There is one file per programme: Kelpcrete, Reading Room, Building and Events. Each file holds ready-made layouts called Start here pages.
- You can work in InDesign yourself, or ask an AI agent to do it. Both follow the same rules.

## Repo details

Branches: 
- `main` holds the released templates
- `development` holds work in progress

Make changes on `development` and merge to `main` when they are checked.

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
