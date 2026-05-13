import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";
import type TodayPlugin from "./main";
import { VIEW_TYPE_TODAY } from "./view";
import { VIEW_TYPE_MULTI_DAY } from "./multiDayView";
import { VIEW_TYPE_HABITS_STATS } from "./habitsView";

export const VIEW_TYPE_SHELL = "today-shell";

// Nav entries rendered in the shell sidebar. `target` is the view-type string
// the content leaf is swapped to when the row is clicked — the sidebar
// itself stays put, so the user keeps a persistent nav while bouncing
// between Today / This week / Reporting in the right-hand pane.
interface ShellEntry {
  label: string;
  description: string;
  icon: string;
  target: string;
}

const ENTRIES: ShellEntry[] = [
  {
    label: "Today",
    description: "Daily-note dashboard.",
    icon: "calendar-clock",
    target: VIEW_TYPE_TODAY,
  },
  {
    label: "This week",
    description: "Multi-day view.",
    icon: "calendar-range",
    target: VIEW_TYPE_MULTI_DAY,
  },
  {
    label: "Reporting",
    description: "Habits + projects + time stats.",
    icon: "bar-chart-3",
    target: VIEW_TYPE_HABITS_STATS,
  },
];

export class ShellView extends ItemView {
  private plugin: TodayPlugin;
  // The leaf that hosts whichever target view is currently visible. Paired
  // 1:1 with the shell at activation time; if the user closes it manually,
  // `ensureContentLeaf` recreates it on the next nav click.
  private contentLeaf: WorkspaceLeaf | null = null;
  // Last target view-type opened, used to mark the matching nav row as
  // active when re-rendering the sidebar.
  private activeTarget: string = VIEW_TYPE_TODAY;

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

  // Called by `activateShellView` immediately after the split is created so
  // the sidebar knows which leaf to drive. Subsequent re-opens of an existing
  // shell can call this again with a fresh content leaf if the prior one was
  // closed by the user.
  setContentLeaf(leaf: WorkspaceLeaf, initialTarget: string): void {
    this.contentLeaf = leaf;
    this.activeTarget = initialTarget;
    this.render();
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
    root.addClass("dp-shell-nav");

    const header = root.createDiv({ cls: "dp-shell-sidebar-header" });
    header.setText("Today");

    for (const entry of ENTRIES) {
      const item = root.createDiv({ cls: "dp-shell-nav-item" });
      if (entry.target === this.activeTarget) {
        item.addClass("is-active");
      }
      const iconEl = item.createSpan({ cls: "dp-shell-nav-icon" });
      setIcon(iconEl, entry.icon);
      const text = item.createDiv({ cls: "dp-shell-nav-text" });
      text.createDiv({ cls: "dp-shell-nav-label", text: entry.label });
      text.createDiv({ cls: "dp-shell-nav-desc", text: entry.description });
      item.addEventListener("click", () => void this.openTarget(entry));
    }
  }

  private async openTarget(entry: ShellEntry): Promise<void> {
    const leaf = await this.ensureContentLeaf();
    await leaf.setViewState({ type: entry.target, active: true });
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
    this.activeTarget = entry.target;
    this.render();
  }

  // Returns the paired content leaf, recreating it if the user closed it.
  // The fresh leaf is opened to the right of the shell via `createLeafBySplit`
  // so the layout matches what `activateShellView` set up initially.
  private async ensureContentLeaf(): Promise<WorkspaceLeaf> {
    if (this.contentLeaf && isLeafAttached(this.contentLeaf)) {
      return this.contentLeaf;
    }
    const fresh = this.app.workspace.createLeafBySplit(this.leaf, "vertical");
    this.contentLeaf = fresh;
    return fresh;
  }
}

// True when the leaf is still part of the workspace tree (i.e. not closed).
// `parent` is cleared by Obsidian when a leaf is detached, so this is the
// cheapest signal we can read without instanceof-checking against internal
// types.
function isLeafAttached(leaf: WorkspaceLeaf): boolean {
  return !!(leaf as unknown as { parent?: unknown }).parent;
}
