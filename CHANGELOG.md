# Changelog

## 2026-05-06

### Edit modal: lift `#tid/<id>` out of the title into a clickable header pill

- **Requested:** "when a task has a tid in it, and i open the modal, i
  can see the tid in the title. I have to delete it from the title, or
  it will duplicate the task id. i shouldn't have to do that. parse out
  the task id and put the id in the top right corner, which is a
  clickable tag so i can see in the search the other instances of that
  task id."
- **Done:** `cleanBody` (`src/view.ts`) now strips `#tid/<id>` so the
  title input no longer carries it (which was the source of the
  on-save duplication). The tag is surfaced as a small pill in the top
  right of the modal header (`.dp-edit-tid-pill`, `src/styles.src.css`)
  that, when clicked, opens Obsidian's global search for
  `tag:#tid/<id>` so the user can find every other occurrence of that
  task id. The tid is still preserved in the underlying line on save
  because `setTaskTitle` keeps the existing tag block.

### Apply daily-note template when files are created via link-following

- **Requested:** "when i click the hyperlink to the date that doesn't
  exist, it's not rendering the template. it renders the template when i
  click the arrows or the calendar on the plugin, but when i click on a
  link inside my obsidian vault it doesn't create the template. let's
  make sure that if a date file is created afresh inside of daily/ folder
  that it loads the template."
- **Done:** Added `applyDailyNoteTemplateIfEmpty` in `src/dailyNote.ts`
  and registered a `vault.on("create")` listener in `TodayPlugin.onload`
  (`src/main.ts`). When any new `.md` file lands in the configured daily
  folder with a basename that parses against the daily-note format and
  is empty, the listener writes the expanded template into it. The empty
  guard means our existing `ensureDailyNote` path (which writes content
  up front) is left alone, and any other plugin that fills the file
  first wins.

### Daily-note template: bare `<@today>` is wall-clock; add `<@…-rel>` parsed from filename

- **Requested:** Pick semantics (A) — bare `<@today>` resolves to real
  wall-clock today; `<@today-rel>` and friends resolve relative to the
  filename's date. Parse the filename so `-rel` works in any file with a
  date-shaped name, not just inside `ensureDailyNote`.
- **Done:** Reworked `expandDateTemplate` in `src/dailyNote.ts` to take
  `fileBasename` instead of a pre-resolved `refDate`. The regex now
  recognizes an optional `-rel` suffix; bare keywords anchor to
  `new Date()` while `-rel` keywords parse the basename via the daily-note
  format string in moment strict mode. `ensureDailyNote` derives the
  basename from the resolved path and passes it through. If the filename
  doesn't match the expected format the `-rel` placeholder is left
  intact so the mismatch is visible in the file.

### Add CLAUDE.md + initial CHANGELOG.md

- **Requested:** "updae CLAUDE.md to create a changelog - after you
  finish, update CHANGELOG.md with 1) what was requested and 2) what you
  did."
- **Done:** Created `CLAUDE.md` documenting the changelog convention
  (newest-first by date, "Requested" + "Done" per entry) and seeded
  `CHANGELOG.md` by backfilling the recent settings reshuffle, the
  autocomplete intro tweak, the `@`-trigger date autocomplete, and the
  in-progress template substitution.

### Edit modal: bigger action icons, labeled move popover

- **Requested:** "these icons are too small. make them bigger. Also, when
  i click the 'move' icon, i want words to pop up, the words showing the
  hotkeys like move (w)hole or move (i)ncompleted. I also don't want the
  original move icon to disappear (right now it disappears)."
- **Done:** Bumped `.dp-edit-icon-btn` from 32→40 px (svg 16→20) and the
  Save button padding to match (`src/styles.src.css`). Replaced the move
  popover's icon sub-buttons with text labels — `Move (t)oday`, `Move
  (w)hole`, `Move (i)ncomplete` — with the hotkey letter highlighted in
  the accent color via a new `.dp-edit-move-hotkey` span. The original
  move icon now stays visible while the popover is open; clicking it
  again closes the popover (`src/view.ts`).

### Settings layout: move #ta into Pomodoro, split Task ID into its own section

- **Requested:** "in the settings, move the #ta into the top of the Pomo
  section. Create a new section for Task ID"
- **Done:** Moved the "Actual time tag prefix" (`#ta`) row from the end of
  the Defaults section to the top of the Pomodoro section. Lifted "Task ID
  tag prefix" and "Task ID length" out of Defaults into a new "Task ID"
  section that renders between Pomodoro and Autocomplete
  (`src/settings.ts`).

### Note that autocomplete triggers are mainly a mobile convenience

- **Requested:** "on the autocomplete description, add 'These are mostly
  conveniences for mobile where typing is slow'."
- **Done:** Appended that sentence to the Autocomplete intro paragraph
  (`src/settings.ts`).

### `@`-trigger date autocomplete inserting daily-note links

- **Requested:** A new `@` autocomplete that handles relative dates —
  `@today`, `@yesterday`, `@tomorrow`, `@Nd` — inserting a link to the
  matching daily note. Optional moment.js display format (default
  `ddd, MMM D, YYYY` → "Mon, Mar 5, 2026"). Wiki vs. markdown form per
  vault settings. Must work in tasks (`- [ ] @today …`) and in plain files,
  including at the start of a line.
- **Done:** Added `dateTrigger` to `AutocompleteSettings` (default `@`) and
  `dateLinkFormat` to `TodaySettings` (default `ddd, MMM D, YYYY`). New
  `buildDateSuggestions` and `buildDateLinkInsert` helpers in
  `src/dailyNote.ts` honor `app.vault.getConfig('useMarkdownLinks')` to
  pick wiki vs. markdown form. Wired into both the in-editor
  `EditorSuggest` (`src/main.ts`) and the modal title-input rule list
  (`src/view.ts`). Trigger detection now prefers the longer trigger when
  two overlap (so `#@` keeps winning over its own `@` suffix), and the
  column-0 "must have leading non-whitespace" rule now only applies to
  `#`-starting triggers — `@today` at the start of a line fires the
  picker. Settings UI exposes the trigger field and the date-link format.

### Daily-note template: substitute `<@today>` etc. on note creation

- **Requested:** "the templating parser should look for `<@yesterday>`,
  and if so, it will fill in the template value." Followed by:
  introduce `-rel` variants (`<@today-rel>`, `<@yesterday-rel>`) that
  resolve against the new file's filename so relative relationships
  survive when notes are pre-created for future dates.
- **Done (partial):** Added `resolveDateKeyword` and `expandDateTemplate`
  in `src/dailyNote.ts`. `ensureDailyNote` now passes the template through
  the expander, replacing `<@today>`, `<@yesterday>`, `<@tomorrow>`, and
  `<@Nd>` with daily-note links resolved against the note's own date.
  `DailyNoteFallback` gained a `dateLinkFormat?: string` field; the five
  `ensureDailyNote` call sites in `src/view.ts` now pass it.
- **Open:** Awaiting clarification on `-rel` semantics — specifically
  whether the bare `<@today>` form should switch to wall-clock today
  (with `-rel` becoming the file-relative variant), or whether `-rel` is
  an explicit alias for the file-relative behavior already implemented.
  Not yet committed.
