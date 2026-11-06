# Start here: first-time prompt for an AI agent

Copy everything below the line and paste it into your AI agent. Run it once. It needs a strong model, for example the latest Codex/GPT, or Claude Opus or Sonnet. Open the repo folder in the agent first so it can read the files.

---

You will help me make social posts from InDesign templates. Before anything else, read `AGENTS.md`, `README.md` and `GLOSSARY.md` in this folder. Use the glossary's words.

## Safeguards (they apply to everything you do)
- Never save, edit or Book-sync anything in `indesign/`. Always Save As into `content/` first. Check the active document's path before any edit.
- Never change paragraph styles, object styles, parents, swatches or the grid. Only text and placed images change.
- Before export, check: no overset text, Archivo installed, no missing links, the right page size.
- If something fails twice, stop. Explain in plain words what happened and ask me. Do not improvise a workaround on the templates.
- If a template file is damaged, tell me. I restore it from `archive/templates-backup-2026-11-06.zip`.

## Step 1: How will you work with InDesign?
Ask me how you will work with InDesign.
- If I already know, record my answer and go to step 2.
- If I do not know, **start with computer control**. Posts need only small edits, so this is the first thing to try. Check whether you can see and control my screen. If you can, ask me to give you that access, then go to step 2. If you cannot, or I decline to give access, explain the fallbacks in plain words and help me choose. Read `docs/connecting-indesign.md` for the details.
  1. **Computer control (try first):** you operate my Mac like a person (screenshots, clicks). Needs no plugins. It works only if my agent setup offers it.
  2. **An InDesign MCP server:** a scripting bridge that lets you run InDesign scripts. I research and install one myself. It was tested with Claude and a local InDesign MCP server; it is not tested with Codex.
  3. **Scripts I run myself:** you write an InDesign script for each post and I run it in InDesign. You get no access to my machine.
  4. **Sidekick** (https://sidekick.eastpole.nl/): a plugin for InDesign plus an extension for my AI assistant. Paid after a free trial. Describe it only from what the site says.
  5. **Manual:** you write the copy, pick the layout and give me click-by-click steps. I do the InDesign work. No setup; always works.
- If I choose an option that needs installing, guide me through it one step at a time. Check that it works before you move on.

## Step 2: Dry run
Make one test post to prove the method works.
1. Create `content/test-<today's date>/`.
2. From the Kelpcrete programme file, pick a 4:5 Start here page. Save As a copy in that folder as `post.indd`. Confirm the active document path is inside `content/`.
3. Change one text frame and keep the rest.
4. Delete the pages you do not need, including the last page (the swatch reference).
5. Export a JPEG into the same folder. Confirm it is 1080×1350 pixels.
6. Tell me the result.

The dry run passes when the export is 1080×1350, `indesign/` is unchanged, and I have seen the result.

## Step 3: Record it
Write the following into `docs/agent-setup.md`, replacing its placeholders:
- the method I chose,
- the dry-run date, folder and result,
- the exact steps or commands that worked,
- any quirks.

Later sessions read that file and skip setup. Tell me when it is saved.

## Copy rules
My tone and word limits are not written down yet. Ask me for them before you write post copy, and offer to save them in the "Copy rules" section of `AGENTS.md`.
