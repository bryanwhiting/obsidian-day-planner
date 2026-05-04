# Daily Notes Planner

An Obsidian sidebar plugin that turns hashtag-annotated tasks in your daily notes into a draggable timeline. The note is the single source of truth — drag operations only modify hashtags on existing lines, never reorder lines in the file.

Compatible with the Tasks plugin: works on standard markdown checklist lines (`- [ ] ...`), only the new `#d/`, `#t/`, and `#o/` hashtags are added.

## Tag grammar

| Tag | Meaning | Examples |
|---|---|---|
| `#d/<dur>` | Duration | `#d/90m`, `#d/2h`, `#d/1h30m` |
| `#t/<time>` | Start time (am/pm) | `#t/10a`, `#t/2p`, `#t/1030a`, `#t/2pm` |
| `#o/<n>` | Sort order in the unscheduled list (managed by the plugin) | `#o/3` |

A task line needs at least `#d/` to appear in the planner. Add `#t/` to schedule it; without `#t/` it shows in the unscheduled list.

Decimals (`#d/1.5h`) and colons (`#t/10:30a`) are not supported — use `#d/1h30m` and `#t/1030a`.

## Usage

- The sidebar shows two sections: today's daily note (always) and the currently active note when it differs from today's daily note. Each section has its own scheduled/unscheduled totals.
- Drag a block in the timeline to a new time slot → rewrites `#t/`.
- Drag a block out to the unscheduled list → strips `#t/`, appends `#o/<next>`.
- Drag a card in the unscheduled list above/below another → renumbers `#o/` for affected cards.
- Drag the bottom edge of a block up/down to resize → rewrites `#d/`.
- Click a block or card to open the source line in the editor.

The plugin never moves lines in the file. Sort order in the UI is derived from the tags it reads.

## Install

Clone the repo into your vault's plugins folder:

```bash
cd /path/to/your-vault/.obsidian/plugins
git clone https://github.com/bryanwhiting/obsidian-daily-notes-planner daily-notes-planner
```

Then in Obsidian: **Settings → Community plugins**, turn off Restricted Mode if needed, click the reload button next to "Installed plugins", and enable **Daily Notes Planner**.

The committed `main.js` is the prebuilt bundle, so no build step is needed for installation.

## Updating

```bash
cd /path/to/your-vault/.obsidian/plugins/daily-notes-planner
git pull
```

Then in Obsidian, run the **Reload app without saving** command (Cmd/Ctrl+P → "Reload"), or toggle the plugin off and back on.

## Development

```bash
npm install
npm run dev      # esbuild watch — rebuilds main.js on every change
npm run build    # production build
npm run typecheck
```

Reload the plugin in Obsidian after each rebuild ("Reload app without saving" command).

## Settings

- Visible start hour / end hour (default 6–23)
- Snap interval (default 15 min)
- Pixels per minute (default 1)
- Tag prefixes (`d`, `t`, `o`) — change if they conflict with other tags you use
- Daily-note format fallback (used if the core Daily Notes plugin isn't enabled)

## Files

- `src/parser.ts` — tag regexes, line rewriters
- `src/scheduler.ts` — overlap layout for side-by-side blocks
- `src/view.ts` — sidebar `ItemView`, drag-drop, resize
- `src/dailyNote.ts` — resolves today's daily note (reads core Daily Notes settings)
- `src/settings.ts` — settings tab
- `src/main.ts` — Plugin entry, ribbon, command, settings load/save
- `styles.css` — timeline grid, blocks, cards
- `manifest.json` — plugin metadata

## License

MIT
