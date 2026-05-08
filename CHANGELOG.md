# Changelog

## 2026-05-07

- [fix/feat]: Calendar block resize on mobile only advanced one snap step before the gesture stopped — the `.dp-resize-handle` had no `touch-action`, so after the first move the browser hijacked the vertical drag as a scroll on the timeline pane and cancelled pointer capture. Added `touch-action: none` so the handle owns the gesture for its full length. Also added a top resize handle (`.dp-resize-handle-top`) on every block with an explicit start time: dragging it anchors the end time and shifts both start (`#t/`) and duration (`#d/`) in lockstep, snapping to the configured interval and clamping at the snap minimum / midnight. Files: `src/view.ts` (top handle wiring in `renderBlock`, new `beginResizeTop` + `applyStartAndDurationChange`), `src/styles.src.css` (`touch-action: none` on the base handle, `.dp-resize-handle-top` variant). The user asked: "on mobile, when i click and drag down the task on the calendar (to expand it), it only lets me drag one 15m block at a time … on both desktop and mobile i'd like to be able to 'drag up', which means if i put my mouse/finger on the top border of the calendar item i could be able to drag the start time earlier".
- [feat]: Task edit/new modal now has a tag picker sitting to the right of the project dropdown, so `#tc/<slug>` labels are managed visually instead of having to be typed inline. Existing tags surface as removable chips, an inline input filters/picks from suggestions sourced via a new `collectContextTagNames()` (mirror of `collectProjectNames()` reading the metadata cache), and Enter on a free-form value adds a new label. On save, the modal compares the resulting list to `initialTags` and routes through a new `setTaskContextTags(rawLine, tags[], prefixes)` parser helper that strips every existing `#tc/` and re-appends the chosen ones; null = unchanged. New `initialTags` and `availableTags` opts on `TaskEditOpts`, and the `onSave` signature gained a `tags` arg before `extras`. Files: `src/parser.ts` (`setTaskContextTags`), `src/view.ts` (modal opts, picker UI inside `.dp-project-row`, `resolveTags()`, `collectContextTagNames`, `applyTaskEdit` accepts/applies tags, new-task path also routes tags through `setTaskContextTags`), `src/styles.src.css` (`.dp-tags-input-wrap`, `.dp-tags-input`, `.dp-tag-chip*`, `.dp-tag-input`). The user asked: "context tags should be visible inside the edit modal frame. i should be able to add more tc tags. Put it to the right of the projects dropdown. let me choose multiple tags (each one adding to the task line)".
- [feat]: Project summary now has a squares-grid visual under the table, mirroring the day-grid box shown under the time summary. Each project contributes one 6×6 colored square per 15 minutes (`Math.round(total / 15)`, min 1 square if any time logged), drawn in the same descending-by-total order as the rows above and tinted with the project's color from `colorMap`. Unassigned minutes get hatched squares using the same diagonal pattern as the swatch. Total square count is unbounded — overlapping or back-to-back tasks for the same project compound naturally, so a day with several parallel time entries can exceed the 96 dots that the time grid uses. Files: `src/view.ts` (`renderProjectTable` now wraps its table in a `dp-stat-col` and calls a new `renderProjectDotGrid`), `src/styles.src.css` (`.dp-day-dot-unassigned` hatched variant). The user asked: "underneath the project summary, can you have a squares visual (similar to the scheduled box) that shows one box per 15m of each project i've worked on? this may be more than 96 since there can me multiple time entries per hour".
- [feat]: Tasks can now carry free-form context labels via a new `#tc/<slug>` tag (e.g. `#tc/billable`, `#tc/client-acme`). Multiple tags per task are allowed; they're parsed onto `ParsedTask.tags` and rendered as small pill chips next to the project label on both timeline blocks and unscheduled cards. New `Task context tag prefix` setting in the Tasks tab lets the user rename the prefix, and the existing prefix-migration flow picks the new key up automatically. Files: `src/parser.ts` (`TagPrefixes.taskContext`, `DEFAULT_PREFIXES.taskContext = "tc"`, regex in `buildTagRegexes`, `ParsedTask.tags`, `parseTaskContexts`, populated in `parseTaskLine`, added to `setTaskTitle`/`setTaskDescription` tag boundary), `src/view.ts` (`cleanBody` strips `#tc/`, render `dp-block-tags`/`dp-card-tags` blocks after the project label), `src/settings.ts` (new prefix Setting in `renderTaskDefaultsSection`, `taskContext` added to migration keys), `src/styles.src.css` (`.dp-block-tags*`, `.dp-card-tags*` pill chips). The user asked: "can you add tags to the tasks? these will all be under #tc - task context. put it next to projects. By putting in tags, I can label things (#tc/billable)".
- [fix]: Narrow timeline blocks (≤15m mini and 16–30m two-line) had the title text element stretching across the rest of the row via `flex: 1 1 auto`, so clicks anywhere on the empty horizontal space after the visible title still hit `.dp-block-text` and toggled the task. Switched to `flex: 0 1 auto` (matching the non-narrow rule) so the title's hit-area sizes to the rendered text and still ellipses when too long. Files: `src/styles.src.css` (`.dp-block.is-narrow-mini .dp-block-text`, `.dp-block.is-narrow-2line .dp-block-text`). The user reported: "the 15m tasks are clickable all across the top border. perhaps because of recent changes to how the rendering works. I still only want the task text to be clickable".
- [feat]: Added three new command-palette commands — **Open today's daily note**, **Open yesterday's daily note**, **Open tomorrow's daily note** — that resolve the daily note for the matching date (creating it from the configured template if it doesn't yet exist) and open it in the active leaf. Files: `src/main.ts` (new `openDailyNoteForOffset` helper, three `addCommand` registrations, `ensureDailyNote` import). The user asked: "can you add a command pallete command for going to today/yesterday/tomorrow's notes".
- [feat]: Habit stats pane: added top-of-pane tabs **Habits** / **Workouts**. Habits tab is the existing Day/Week/Month heatmap stack; Workouts tab is a per-day rep log shaped `| exercise | day1 | day2 … | total |` over the same `habitsStatsWindow` of days, with rows sorted by total reps descending and only counting completed (`- [x]`) sets. Files: `src/habitsView.ts` (`StatsTab` field, `renderTabs`, `renderWorkoutLog`), `src/styles.src.css` (`.dp-habit-stats-tab*`, `.dp-workout-log*`). The user asked: "on the habits stats table, can you show me a tab for workouts? this will have a log of how many pushups I did each day. so the table is | exercise | date1 | date2 | date3 - showing counts for each day".
- [fix]: Habit stats totals (`675 reps • Push-ups 250 · …`) now only sum completed (`- [x]`) exercise sets. Previously they summed every set on every daily note in the window, so future days that already had `#x/…` tags planned but unchecked inflated the totals with intent rather than work done. Files: `src/habitsView.ts` (`buildSection` skips `!set.done` when accumulating `totalReps`/`exerciseTotals`). The user noticed: "the habits stats summary should only be summing exercises where - [x]. i think it's counting future days that haven't yet been logged".
- [fix]: Narrow timeline blocks now adapt the header to how much vertical room they actually have. Previously a 15m overlapping block showed the 3-line stack (icons-time / project / title), but the block is only ~18px tall and the parent's `align-items: center` clipped the top so the title disappeared. Now: ≤15m narrow → single condensed line `4p Run errands` (project + duration hidden, title ellipses but still toggles); 16–30m narrow → two lines `4p Run errands` / `proj/sub` (CSS `order` puts the title next to the time and forces the project to wrap to a new line); >30m narrow keeps the existing 3-line stack. The time string is shortened to just the start time (e.g. `4p`) for ≤30m narrow blocks, and stays as the full `4p–4:15p (15m)` for wider/wide blocks. Files: `src/view.ts` (`renderBlock` adds `is-narrow-mini`/`is-narrow-2line` classes + compact time text), `src/styles.src.css` (mode-specific row layouts; existing 3-line stack scoped to `.is-narrow:not(.is-narrow-mini):not(.is-narrow-2line)`). The user asked: "if it's a 15m meeting, it hides the top because it's centering the text. … let's just show the start time (5p) and title. that's just for the 15m or 30m wrapped. Project can be on 2nd line for the 30m … like `4p Run errands` - so i can still toggle the task on/off".
- [feat]: Timeline blocks: when 2+ events overlap and share a time slot horizontally (each block ≤ 50% of the lane width), the header trio now stacks onto multiple lines — `[icons] time` / `project/sub` / `task title` — instead of trying to fit "(2h 15m) · proj/sub · long task title" on one ellipsed row. Added an `is-narrow` class on the block when `widthPct < 99.5`, wrapped the existing context-icon + warn + time spans in a `.dp-block-meta` container so they stay together as the first stacked line, and switched the narrow row to `flex-direction: column` with separators hidden and title text allowed to wrap. Files: `src/view.ts` (`renderBlock` adds `is-narrow` class + `.dp-block-meta` wrapper), `src/styles.src.css` (`.dp-block-meta`, `.dp-block.is-narrow .dp-block-row/.dp-block-sep/.dp-block-text/.dp-block-project-wrap`). The user asked: "When there are two calendars at the same time, can you update it so that it line breaks? e.g., time\\nproj\\ntask?".
- [chore]: Settings: rename the "Hotkeys & Defaults" tab to "Automations". Files: `src/settings.ts` (`TAB_SPECS.general.label`). The user asked: "rename 'hotkeys & Defaults' to 'Automations'".
- [feat]: Settings: new **Day** tab (`sun` icon) holding the work-hours and wake/sleep settings, pulled out of View. View now contains just timeline rendering (pixels per minute, visible start/end hour, timeline heights). Files: `src/settings.ts` (`SettingsTab` adds `day`, `TAB_SPECS` entry, `renderDaySection`, `renderViewSection` slimmed). The user asked: "add a new 'day' config, this is the work day start/end and sleep. - i mean a new day tab, not config".
- [feat]: Habits dashboard: a weekly/monthly habit completed on a specific day now strikes through only on that day's view and disappears entirely from other days in the same window. Previously a Mon-checked weekly habit showed as completed (struck through) on Mon, Tue, Wed, …; now Tue's view doesn't list it at all. Reduces visual noise on days where the user didn't contribute to a given habit. Daily habits unaffected (their window is the displayed day). Implemented by adding `checkedOnDisplayedDate` to the per-habit display state and filtering on `isComplete && !checkedOnDisplayedDate`. Settings toggle "Hide completed habits" still hides every completed habit including the day it was checked. Files: `src/view.ts` (`HabitDisplay.checkedOnDisplayedDate`, `loadHabitDisplays`, visibility filter in `renderHabitsLine`), `src/settings.ts` (toggle copy). The user asked: "if i complete a habit today, cross it off on the summary bar. if i completed a task on another day, then don't show the habit (reduce the visual complexity). so a habit completed on may 5 will appear as crossed out on the may 5th summary view, but not on the may 6th summary view".
- [feat]: Settings: added two new tabs — **Tasks** (`list-checks`) and **View** (`eye`). Tasks holds the Defaults section (default duration, quick-duration chips, snap interval, duration/time/order/exercise tag prefixes), Task ID, and Notes (note + intention tags). View holds Pixels per minute (moved out of Defaults) plus the Day-config block (visible/work/wake hours + timeline heights). Hotkeys & Defaults is now just Autocomplete + Templating. Files: `src/settings.ts` (`SettingsTab` extended w/ `tasks`/`view`, `TAB_SPECS` entries, dispatch, `renderDefaultsSection` → `renderTaskDefaultsSection` w/o pxPerMin, `renderDayConfigSection` → `renderViewSection` w/ pxPerMin at top). The user asked: "let's create a 'Tasks' tab. this has the settings about task id, also the duration, the snap interval, etc. … Then have a 'view' tab - which relates to the height/timeline choices".
- [fix]: Settings: bumped the divider under the tab chips to 2px and dropped the redundant border-bottom on the intro block so the tab strip reads clearly as nav. Files: `src/styles.src.css` (`.dp-settings-tabs` border-bottom 1px → 2px, `.dp-settings-intro` no longer draws a border). The user asked: "have a line underneath the tab chips so it's easy to see it's a setting".
- [feat]: Habit tag syntax migrated from `#h/<period>/<slug>` to `#h-<period>/<slug>[/<target>]`, mirroring the exercise-goal shape (`#x-<period>/<name>/<target>`). The optional trailing `/N` sets a per-period target — `#h-week/laundry/2` means "twice per week"; the dashboard chip shows `laundry 1/2` in progress and the stats heatmap colors weekly cells met/not-met against the target (target=1 habits keep the count-shaded heatmap). Toggling habits and the per-file duplicate warning still work as before; the duplicate warning is suppressed for target>1 habits since multiple checks per file are legitimate progress. Migrated all `#h/day/`, `#h/week/`, `#h/month/` occurrences in the vault. Files: `src/habits.ts` (`Habit.target`, regex, `parseHabitsFile`, `appendHabitLine`), `src/view.ts` (`HabitDisplay.checkedCount`, chip progress span), `src/habitsView.ts` (heatmap intensity + label target), `src/settings.ts` (copy update), `src/styles.src.css` (`.dp-habit-progress`). The user asked: "I want to improve the habits — maybe i want something done N times a day. let's do B, migrate to h-week h-day syntax. and keep x-day".
- [feat]: Settings: added an intro block above the tab bar (display-font title + muted blurb with a README link) and Lucide icons on each tab — `sliders-horizontal` for Hotkeys & Defaults, `folder-kanban` for Projects, `timer` for Pomodoro, `repeat` for Habits. Active tab tints both the chip and the icon with the accent color. Files: `src/settings.ts` (`renderIntro`, `TAB_SPECS` w/ icons, `setIcon` import), `src/styles.src.css` (`.dp-settings-intro*`, `.dp-settings-tab-icon`, `.dp-settings-tab-label`). The user asked: "can you have an intro text above the tabs? can you style the tabs with lucide-react icons?".
- [feat]: Settings UI organized into 4 tabs — Hotkeys & Defaults, Projects, Pomodoro, Habits — with a tab bar at the top of the settings pane. Switching tabs swaps the body. "Hotkeys & Defaults" gathers Defaults, Task ID, Autocomplete, Notes, Templating, and Day-config sections; "Projects" gathers Projects + Context tags; the other two tabs each hold their single existing section. Files: `src/settings.ts` (new `SettingsTab` type, `activeTab` state, `renderTabs`, dispatch in `display()`), `src/styles.src.css` (`.dp-settings-tabs`, `.dp-settings-tab`, `.is-active`, `.dp-settings-pane`). The user asked: "can you make the Settings more readable? … Can you make tabs for Hotkeys and Defaults / Projects / Pomodoro / Habits".

## 2026-05-06

- [feat]: Edit-task modal duration row: (1) selected chip now uses solid-accent fill + on-accent text so the selection stays unmistakable instead of fading into focus/hover styles, and (2) added a custom-duration text input under the chip row, pre-filled with the current duration so it's visible even when none of the quick-duration chips match. Accepts free-form values (`30m`, `1h`, `1h30m`, `90m`) and tolerates a leading `#d/` tag if pasted. Typing in the field updates the chip selection live and the selected-duration state; clicking a chip mirrors back into the field. Enter still submits. Files: `src/view.ts` (TaskEditModal duration row: `refreshDurButtons`, `durInput`, sync in chip handler + `#$` autocomplete commit; Enter wiring), `src/styles.src.css` (`.dp-duration-btn.is-selected` solid accent fill, `.dp-duration-custom-row` + `.dp-duration-custom-input`). The user asked: "when i pick a duration in the edit task modal, it doesn't highlight. if a duration is already present, it should show in a text box. if i need a custom duration, i can go into the text box, and it shoudl parse my tags (td) for a recommendation".
- [feat]: Date autocomplete: month-name queries now show two rows — the upcoming occurrence and the most recent past occurrence — with the year in the row label so they're distinguishable. So `@jan 5` on 2026-05-06 lists `jan 5 2027` (default, on top) and `jan 5 2026`. Year search spans today ± 4 so a leap-day query like `@feb 29` still finds candidates. Files: `src/dailyNote.ts` (`buildMonthSuggestions` returns both future + past with year-bearing keywords). The user asked: "Jan 5 could mean next jan 5 (future) or past jan 5. have both as options, default to the future being on the top, show the year in the selector".
- [fix]: First click on the plugin pane no longer feels "absorbed". The view was re-rendering on every workspace `active-leaf-change` event, including the one fired synchronously when clicking the inactive pane activated it — so ~100ms after every entering click, `root.empty()` wiped and rebuilt the entire DOM, which read as a flash that swallowed the click. Now the listener only schedules a render when the workspace's active *file* path actually changed (the only thing that listener exists to update — the small "open active file" link). Files: `src/view.ts` (new `lastActiveFilePath`, gate in `onOpen`'s `active-leaf-change` handler, set in `render`). The user asked: "i always have to click the plugin pane once before it activates … i want my mouse to work on the first click".
- [feat]: Date autocomplete (`@`) now recognizes month-name queries with an optional day, e.g. `@apr 5` resolves to the upcoming Apr 5 (rolls forward a year if it'd otherwise be in the past). Both the modal-title trigger and the markdown editor's `EditorSuggest` now allow a single space inside the query when it matches a `month <day>` shape, instead of immediately closing the popover. Files: `src/dailyNote.ts` (`buildMonthSuggestions` + extended `buildDateSuggestions`), `src/view.ts` (new `acceptQuery` opt-in on `TitleSuggestRule`, used by the date rule), `src/main.ts` (`onTrigger` whitespace gate). The user asked: "on the auto-complete for dates, when i do @today it works, i also want @apr 5 and have it work (including the space)".
- [fix]: Edit-task modal: project field now pre-fills with the full `proj/subproj` instead of just the parent. `openTaskEditor` was passing only `task.project` as `initialProject`, so a `#p/workday/ml-design` task opened the modal showing just "workday" — and saving without re-typing the sub-path silently dropped it. Now composes `task.project + "/" + task.subproject` when both are present; `setProjectTag` already accepts the composed form. Files: `src/view.ts` (`openTaskEditor` `initialProjectFull`). The user asked: "you can see that in the Edit Task modal, that the sub-project isn't chosen … i still can't see the chosen sub-project in the edit-task modal".
- [fix]: Timeline-block sub-task rows used to render the raw `#t/HHMM` tag (e.g. `veronica picks up Helena at 6:25 #t/625p`). Now they render the parsed time as a small mono pill at the start of the row (`6:25p · veronica picks up Helena…`), matching how the edit-modal sub-task list already shows it. The body uses `cleanBody` so the tag is stripped from the displayed text. Files: `src/view.ts` (sub-task render branch), `src/styles.src.css` (`.dp-block-subtask-time`). The user asked: "you can see the sub-task has the hashtag for the time. can it render the actual time instead?"
- [fix]: Autocomplete dropdowns (project field + title `##p` / `#@` / `#$` / `@` triggers): make the arrow-key-active row unmistakable and show full `proj/subproj` paths. The prior `surface-hover` background on `.is-active` was nearly invisible on some themes, so users couldn't tell which row was selected even though arrows were wired up. Now uses solid accent bg + white text. Also: project rows now render the full `proj/subproj` as one piece of text instead of project + a faintly-muted `/sub` span (which was disappearing on some themes). Added `scrollIntoView({ block: "nearest" })` on arrow navigation so highlighting an off-screen row scrolls it in. Files: `src/view.ts` (renderers + `updateActive` in both `attachProjectSuggest` and `attachTitleSuggest`), `src/styles.src.css` (`.dp-project-suggest-item.is-active`). The user asked: "I can't see the sub-project on there. just have it be 'proj/subproj' … enable up/down arrows to pick. make sure i can see which is being selected … make sure this works on all dropdowns".
- [feat]: Edit-task modal hotkeys reshuffled to put the action buttons under single keys: `s` show in note, `m` open move, `p` pomodoro, `o` focus description (was `s`). `i` (title), `d` (duration), `x` (delete), `u` (unschedule), `y` (duplicate), `c` (calendar inside the move popover) unchanged. `p` for "focus project" was dropped since `p` is now pomodoro. Also dropped the `title=` attr from every action button — Obsidian renders an `aria-label` tooltip already, so the native browser one was a duplicate ugly tooltip. Files: `src/view.ts` (hotkey table + button attrs). The user asked: "add a hotkey for 'show in note'. let's make this (s). make description 'o'. add one for '(m)ove' and add '(p)omodoro' … get rid of the [system tooltip] that doesn't look good".
- [feat]: Edit-task modal: new "Duplicate" icon button (copy icon, hotkey `y`) inserts a copy of the task line directly under the original. When the task has sub-tasks, a `window.confirm` y/n asks "Copy sub-tasks too?" — OK includes them, Cancel duplicates the parent only. Strips `#tid/` from the copies so duplicate tasks don't share IDs. Files: `src/view.ts` (`duplicateTask`, `onDuplicate` + `hasSubtasks` opts, `runDuplicate`, `y` hotkey). The user asked: "on the bottom of the task modal add a 'duplciate' command with the copy icon. this will be 'y'. it will copy the task. ask if it wants to copy subtasks" / "have a y/n answer on if i want to copy subtasks".
- [feat]: Edit-task modal: `Cmd/Ctrl+Enter` saves from anywhere, including from inside the title/description/project inputs, so the user can commit without first clicking out of the focused field. Plain Enter on title/project still submits (no-modifier-only); the per-input description Cmd+Enter handler was folded into the modal-level keydown to avoid double-fire. The user asked: "add hotkey 'cmd + enter' to save the task while i'm editing it".
- [fix]: Edit-modal hotkeys weren't firing because (1) the modal auto-focused the title input on open, and the handler bails on INPUT focus, and (2) the keydown listener was on `contentEl`, which doesn't see events from the close button (Obsidian's default focus, in `modalEl` outside contentEl). Fix: don't auto-focus title in edit mode, and attach the keydown listener to `modalEl` instead. Also added field-jump hotkeys: `i` focus title (with the same trailing-space trick the auto-focus used to do), `s` focus description, `p` focus project, `d` focus the selected duration button. New mode still auto-focuses title since the user is creating from scratch and needs to type immediately. The user asked: "the hotkeys aren't working … let's actually not activate anything, and create a hotkey (i) for editing the task title. and (s) for going into the task description. (p) for project, (d) for duration".
- [feat]: Edit-task modal: bottom-left "Delete" button (hotkey `x`, with `window.confirm()` permission prompt) drops the task line and its sub-tasks; new "Unschedule" icon button next to Pomodoro (hotkey `u`) strips the `#t/` time tag so the task falls back into the unscheduled bucket. Both close the modal on success. Hotkeys defer to the move stage-two popup when it's open, and skip while the user is typing. Files: `src/view.ts` (callbacks, `deleteTaskLines`, `unscheduleTask`, modal buttons + `onModalKey`), `src/styles.src.css` (`.dp-edit-delete-btn` with `margin-right: auto`). The user asked: "in the bottom left corner of the edit task modal, add a 'delete'. make the hotkey 'x' for it. ask for permission to delete. Add another button for 'u' to move it to 'unscheduled' (strip the time)."
- [fix]: Move-button calendar entry now renders as a calendar-icon button (with `(c)` hotkey) instead of the text "calendar", and opens the same `dp-calendar` widget the navbar uses (extracted into a free `renderPickerCalendar` helper). The widget swaps in over the choices row anchored to the move button; clicking a day moves the task there, Escape returns to the choices row. Files: `src/view.ts` (helper + `moveCalendarPick` opts + popover swap), `src/styles.src.css` (`.dp-edit-move-choice.is-calendar` + `.dp-edit-move-calpopover`). The user asked: "make the calendar a (c) with a calendar icon. use the same calendar widget that's on the navbar".
- [feat]: Move-button cluster gets a 4th "calendar" entry (hotkey `c`). Pops the OS-native date picker pre-set to the currently-viewed day; picking a date moves the task there, cancel/blur leaves it put. Sits after `next week` so the existing 1-4 numeric hotkeys are unchanged. The user asked: "on the 'move file' button have a 4th otpion (c) that's calendar. it brings upa  widget and lets me choose which date to move it to".
- [feat]: Habit-stats pane: workout-goal grid below the reps total in each section. Goals live in the habits-source file as plain hashtag lines like `#x-day/Pushups/25` (daily goal) or `#x-week/Push-ups/50` (weekly goal); the prefix is the configured exercise prefix plus `-day` / `-week` / `-month`. Each goal row shows the exercise name, target chip (`≥25`), and a per-bucket cell that fills when the bucket's completed reps ≥ target. Hover tooltip shows `<reps>/<target> reps (XX%)`. Day/week/month sections each render their matching goals (filtered by period). Files: `src/habits.ts` (added `ExerciseGoal` + `parseExerciseGoals`), `src/habitsView.ts` (goal rows + grid render), `src/styles.src.css` (target chip + grid spacing). The user asked: "let's do exercise goals. the hashtag for this is #x-day/Pushups/25 or #x-week/Push-ups/50 … see if I met my daily goal or not … habits on top and workouts below. reps first, then the same type cards for whether or not i met my exercise goal".
- [feat]: Habit-stats heatmap, week section: simplify column labels. Each week column now shows just the day number ("1", "8", "15") with a month band ("MAR", "APR") spanning above the columns that fall in each month. Lets the cells stay at their current 12px width while keeping the time orientation legible. The user asked: "can you somehow simplify the Week headers? … mar              Apr / 1   8   15  …  5".
- [fix]: Habit-stats heatmap: bump cell size 10→12px and column-gap 8→10px so week ("3/13") and month ("Aug") column labels stop squishing into their neighbors. Track width 18→22px. The user asked: "space the squares out horizontally a little more, as the week headers are still pretty squished. maybe make them 20% wider?"
- [fix]: Habit-stats heatmap: collapse the q1–q4 saturation gradient into a single solid accent fill — habit satisfaction is binary ("did I do it?"), and the gradient was obscuring the signal the user cares about. The user asked: "can you fill in the squares if the habit was satisfied?"
- [fix]: Habit-stats heatmap: completed cells were nearly invisible on light themes (q1 = 50% accent + paper-2 read as near-white), and column labels (`3/13`, `Aug`, etc.) were squished against each other in the 13px tracks. Bumped column-gap from 3px → 8px so labels have breathing room, and bumped saturations to q1 = 75%, q2 = 88%, q3 = 95% so a single completion clearly pops. The user asked: "the cells are blank - also, the titles are squished. Space them out a little more."
- [fix]: Habit-stats heatmap cells were too big and the "no completion" cells were nearly invisible — making it look like only the current day had a box. Cells are now 10px × 10px with 2px corners and a faint inset shadow, matching the project-totals swatches. q0 (no completion) now has the same crisp outline as a colored cell so all days in the window show up consistently. Adjusted hover scale to 1.4× since cells are smaller. The user asked: "why does it only show boxes for one day? it should show them for all the days" and "make the habit stats boxes the same size as the 'project' boxes - they should be small and clean. same as those other project boxes."
- [feat]: Move button in the edit modal now opens a date picker — "tomorrow", the next two day-name buttons, and "next week" (first day of the upcoming week, driven by the habits week-start setting). Each entry moves the whole task to that date; numeric hotkeys 1–4. "Next week" is dropped when its date already appears as one of the next-3-days. The previous whole/incomplete/today cluster is gone. The user asked: "when i click 'move' have it ask me 'when' / and have it make a little pop up 'tomorrow, fri, sat, next week' / it should show the next 3 days and then 'next week' means on the first day of the next week (so sunday)".
- [fix]: Habit stats grid layout was broken on wide panes — cells rendered crammed against the right edge with column labels overlapping each other and only the last cell visible per row. Switched to `display: inline-grid` (so the grid takes its content width instead of stretching), set the grid template inline as literal `140px <14px tracks…>` (no CSS-variable indirection), gave the habit-label column a fixed 140px width with overflow-ellipsis so cells across all rows align, and let column labels overflow visually into adjacent tracks rather than truncating mid-digit. Combined the per-section reps total and per-exercise breakdown onto a single line (`675 reps • Push-ups 250 · Sit-ups 225 · …`). Added a hairline divider between adjacent sections (Day → Week → Month). The user asked: "it's pretty messed up - i can't see the table.s. can you fix it? also, move the reps to one line: 675 • pushups 350 …" and "have a horizontal divider between sections."
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
