# Connecting an agent to InDesign

Posts need only small edits: swap some text and an image, then export. So start with the simplest route and move down the list only if it fails or you do not want it.

`START-HERE-PROMPT.md` walks through this and records the choice in `agent-setup.md`.

## First choice: computer control
The agent operates the Mac like a person: it takes screenshots, clicks and types in InDesign.
- **Pros:** nothing to install. Fits small edits well.
- **Cons:** slower than a script. It works only if your agent app offers computer use (for example Codex). It needs your permission to see and control the screen.
- **Try it first.** Give the agent access, run the dry run, and see if it holds up.

Move to a fallback below if computer control is not available, does not work well, or you do not want the agent to have access to your machine.

## Fallbacks
Pick whichever suits you. The order is not a ranking.

### An InDesign MCP server
A scripting bridge that lets the agent run InDesign scripts directly. You research and install one yourself.
- We tested this route with Claude using a local InDesign MCP server. It is not tested with Codex.
- **Pros:** fast and precise once working; free options exist.
- **Cons:** technical setup; quality varies between servers; scripts can touch any file, so the safeguards in `AGENTS.md` matter most here.

### Scripts you run yourself
The agent writes an InDesign script (ExtendScript, `.jsx`) for each post. You run it in InDesign (Window > Utilities > Scripts). The agent never touches your machine.
- **Pros:** no access given to the agent; you can read what runs.
- **Cons:** you copy, save and run each script, then report errors back. Scripts must follow the safeguards: they work on the Save As copy, never on `indesign/`.

### Sidekick
[Sidekick](https://sidekick.eastpole.nl/) connects an AI assistant to InDesign. From its site:
- It is made by East Pole. It has a plugin for InDesign (2024 or later, macOS or Windows) and an extension or installer for your assistant. The two halves talk on your own machine.
- Listed assistants include Claude Desktop, ChatGPT Desktop, Claude Code, Codex CLI, Cursor, OpenCode and other MCP clients.
- The plugin is sold through Adobe Exchange: 30 days free, then $9.95 a month (as stated on the site on 2026-11-06; check for current terms).
- You type in your assistant, not in InDesign. Both must be running.
- The site says your InDesign file stays on your computer. What the assistant reads goes to your AI provider.

We have not tested Sidekick with these templates.
- **Pros:** ready-made connection with an installer.
- **Cons:** a paid subscription and a third-party plugin.

### Manual
The agent writes the copy, picks the layout and gives click-by-click steps. You do the InDesign work.
- **Pros:** no setup, always works, safest for the templates.
- **Cons:** you do all the clicking.

## How to choose
1. Already know what you use? Use it.
2. Otherwise, try **computer control**.
3. If it is unavailable, unreliable, or you do not want to give access: choose an **MCP server** (if someone technical can install it), **scripts you run yourself** (no access given), **Sidekick** (paid, ready-made) or **manual**.

Whatever you choose, run the dry run in `START-HERE-PROMPT.md` first.
