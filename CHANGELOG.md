# Changelog

## 2026-05-06

- [feat]: Habit stats pane: GitHub-contribution-style layout with one row per habit. Each section (Day / Week / Month) shows a column-header row of bucket labels (date number / week start / month abbrev) and one row per habit of that period; cells are colored by completion count via the `q0..q4` tiers (q1 starts at 50% accent so a single completion is clearly visible). The current bucket gets a subtle accent ring; hover scales the cell. Habit row labels show `slug N/M` where N = cells with at least one completion and M = total cells. Per-section reps total + per-exercise breakdown unchanged. The user asked: "i want a row for each daily/weekly habit. make it look like the Github contribution chart kind of. don't make it exactly like that, because i want a row per habit. so i could have 10 habits stacked if i have 10 daily habits."
- [feat]: Habit click semantics — never delete the task line. Clicking a habit now finds the first `- [ ]` / `- [x]` task line containing the tag and toggles its checkbox in place; if no such line exists, a fresh `- [x]` line is appended. Pre-templated planned-ahead habits are preserved across click/un-click cycles. Completion is now driven by `- [x]` task lines (bare-tag prose lines and unchecked tasks no longer mark a habit complete). When any single daily note has 2+ task lines for the same habit, the chip shows a duplicate badge (`·N` in warn color) and a doubled underline so the user can clean up. The user asked: "When i click on the habit, it rightly creates the todo. But if the todo is already there, it shows up as crossed out. that's not how it should work. Also, if i 'un-check' the habit, it removes it from the file - it shouldn't remove it from the file… If there are duplicates of the habit, have it identify that in the UI somehow."
- [feat]: Habit stats pane: bump heatmap cell contrast (discrete five-tier `q0..q4` color scale instead of a continuous mix), show the date range each row covers next to its title, and add a per-exercise rep breakdown line below each row's totals (sorted by reps, descending). The user asked: "the habit stats are kind of hard to read. can you increase the contrast? also, i want a breakdown of the reps. and the day/week/month should show the dates it's looking at."
- [feat]: Surface a daily "intention" next to the daily-note path in the dashboard header. Configurable bare hashtag (default `#intention`); the rest of the line after the tag becomes the intention, and the first match wins. The user asked: "let's add an intention. again, this is a tag. so if the file has `#intention blah blah` on it, the intention is `blah blah`. And that will sit next to the daily/YYYY-MM-DD.md link. If there are two intentions, just take the first. The `#intention` is a configurable tag".

### Habits tracker: source file, dashboard line, click-toggle, stats pane

- **Requested:** "let's add a habits tracker. The plugin should read
  the settings to find a habits file (default is daily/_habits)…
  habits should have their own hashtag (specified in a setting)… if
  the habits haven't been completed yet this day/week/month, they
  appear below the workout — so it won't disappear with the summary
  collapse… show the uncompleted habits in this format: d:
  call-mom, eat-burrito • w: … • m: … When i click on the habit, it
  will then add a completed task to my file. I can click it a second
  time to un-check it… The other thing is that it should have a
  little button i can click which will show some stats — i want to
  see a heatmap of both exercises and habits… For workouts, find a
  way to sum all the #x/workout/reps." Follow-ups: habits file is
  plain hashtag lines with optional descriptions (no frontmatter);
  writes go to whatever daily note the dashboard is showing; weekly
  habits scan all daily notes in the week; week-start and
  hide-completed are configurable; stats open in a separate pane via
  a `[stats]` link on the habits line.
- **Done:** New `src/habits.ts` owns the parser
  (`parseHabitsFile`), tag regex builder (`buildHabitTagRegex`),
  occurrence counter, line mutators (`appendHabitLine` /
  `removeHabitLine`, with `removeHabitLine` only touching `- [x]`
  lines so prose-tag occurrences are protected), period helpers
  (`weekRange`, `monthRange`, `enumerateDailyNoteDatesInRange`), and
  a memoized `HabitsScanner` that mtime-checks daily-note reads so
  weekly/monthly checks don't thrash the disk on every keystroke.
  New `src/habitsView.ts` registers the `today-habits-stats` view
  with three 10-cell heatmap rows (Day / Week / Month) showing
  completion rate per cell plus total `#x/...` reps in each window.
  `src/view.ts` `renderSection` now renders a `.dp-habits` line
  immediately after `.dp-workout` (which sits in `.dp-header` and
  survives summary collapse), with click-to-toggle chips and a
  trailing `[stats]` link that calls
  `plugin.activateHabitsStatsView()`. `src/settings.ts` adds
  `habitsFile`, `habitPrefix`, `habitWeekStart`,
  `habitsHideCompleted`, and `habitsStatsWindow`, surfaced via
  `renderHabitsSection` between Notes and Templating. `src/main.ts`
  instantiates the scanner, registers the stats view, and adds an
  `open-habits-stats` command. CSS for `.dp-habits*` and
  `.dp-heatmap*` lives next to `.dp-workout` in
  `src/styles.src.css`, with cell colors driven by a
  `--dp-heatmap-intensity` custom property.

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
