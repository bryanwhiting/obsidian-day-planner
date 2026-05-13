import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";
import type TodayPlugin from "./main";
import { VIEW_TYPE_TODAY } from "./view";
import { VIEW_TYPE_MULTI_DAY } from "./multiDayView";
import { VIEW_TYPE_HABITS_STATS } from "./habitsView";

export const VIEW_TYPE_SHELL = "today-shell";

// Sidebar entries shown in the shell. Each `target` is the view-type string
// that `leaf.setViewState` is called with when the row is clicked — the leaf
// is swapped to that view in place, so the user lands on a full-fidelity
// Today / Multi-day / Reporting pane. To return to the shell, re-open it via
// the ribbon icon or the command palette.
interface ShellEntry {
  label: string;
  description: string;
  icon: string;
  target: string;
}

const ENTRIES: ShellEntry[] = [
  {
    label: "Today",
    description:
      "Today's daily-note dashboard — timeline, unscheduled rail, habits, intentions, pomodoro.",
    icon: "calendar-clock",
    target: VIEW_TYPE_TODAY,
  },
  {
    label: "This week",
    description:
      "Multi-day view — drag tasks between days, see the week at a glance.",
    icon: "calendar-range",
    target: VIEW_TYPE_MULTI_DAY,
  },
  {
    label: "Reporting",
    description: "Habits, projects, and time-tracking stats with three tabs.",
    icon: "bar-chart-3",
    target: VIEW_TYPE_HABITS_STATS,
  },
];

export class ShellView extends ItemView {
  private plugin: TodayPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_SHELL;
  }

  getDisplayText(): string {
    return "Today shell";
  }

  getIcon(): string {
    return "layout-dashboard";
  }

  async onOpen(): Promise<void> {
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  private render(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass("dp-shell");

    const sidebar = root.createDiv({ cls: "dp-shell-sidebar" });
    const header = sidebar.createDiv({ cls: "dp-shell-sidebar-header" });
    header.setText("Today");

    for (const entry of ENTRIES) {
      const item = sidebar.createDiv({ cls: "dp-shell-nav-item" });
      const iconEl = item.createSpan({ cls: "dp-shell-nav-icon" });
      setIcon(iconEl, entry.icon);
      item.createSpan({ cls: "dp-shell-nav-label", text: entry.label });
      item.addEventListener("click", () => void this.openTarget(entry));
    }

    const content = root.createDiv({ cls: "dp-shell-content" });
    const card = content.createDiv({ cls: "dp-shell-welcome" });
    card.createEl("h2", { text: "Today plugin" });
    card.createEl("p", {
      cls: "dp-shell-welcome-sub",
      text: "Pick a view from the left. Clicking a row opens that view in this pane.",
    });

    const list = card.createDiv({ cls: "dp-shell-welcome-list" });
    for (const entry of ENTRIES) {
      const row = list.createDiv({ cls: "dp-shell-welcome-row" });
      const iconEl = row.createSpan({ cls: "dp-shell-welcome-icon" });
      setIcon(iconEl, entry.icon);
      const text = row.createDiv({ cls: "dp-shell-welcome-text" });
      text.createDiv({ cls: "dp-shell-welcome-label", text: entry.label });
      text.createDiv({
        cls: "dp-shell-welcome-desc",
        text: entry.description,
      });
      row.addEventListener("click", () => void this.openTarget(entry));
    }
  }

  private async openTarget(entry: ShellEntry): Promise<void> {
    // Swap the current leaf's view to the target. `active: true` focuses the
    // new view; Obsidian destroys this ShellView instance as part of the
    // state change, so we don't need to clean up containerEl ourselves.
    await this.leaf.setViewState({
      type: entry.target,
      active: true,
    });
  }
}
