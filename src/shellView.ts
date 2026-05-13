import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";
import type TodayPlugin from "./main";
import { TodayView, VIEW_TYPE_TODAY } from "./view";
import { MultiDayView, VIEW_TYPE_MULTI_DAY } from "./multiDayView";
import { HabitsStatsView, VIEW_TYPE_HABITS_STATS } from "./habitsView";

export const VIEW_TYPE_SHELL = "today-shell";

// `target` distinguishes which embedded view to mount when the row is
// clicked. The shell instantiates the corresponding ItemView subclass with
// its containerEl/contentEl rerouted into a host div inside the shell's
// content area — so the user sees one SaaS-style window with a sticky
// sidebar instead of two Obsidian leaves.
type ShellTarget = "today" | "week" | "reporting";

interface ShellEntry {
  target: ShellTarget;
  label: string;
  description: string;
  icon: string;
}

const ENTRIES: ShellEntry[] = [
  {
    target: "today",
    label: "Today",
    description: "Daily-note dashboard.",
    icon: "calendar-clock",
  },
  {
    target: "week",
    label: "This week",
    description: "Multi-day view.",
    icon: "calendar-range",
  },
  {
    target: "reporting",
    label: "Reporting",
    description: "Habits + projects + time stats.",
    icon: "bar-chart-3",
  },
];

export class ShellView extends ItemView {
  private plugin: TodayPlugin;
  private active: ShellTarget = "today";
  // The view instance currently mounted in the content host (or null when
  // nothing's mounted yet). We hold this so we can call onClose + unload on
  // teardown before swapping in the next view.
  private mounted: { target: ShellTarget; view: ItemView } | null = null;
  private hostEl: HTMLElement | null = null;
  private navItemsEl: HTMLElement | null = null;

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

  // Lets the plugin reuse the shell's embedded TodayView (e.g. for the
  // quick-add-task command) instead of opening a separate TodayView leaf.
  // Returns null when the shell is currently showing a different target.
  public getMountedTodayView(): TodayView | null {
    if (!this.mounted || this.mounted.target !== "today") return null;
    return this.mounted.view as TodayView;
  }

  async onOpen(): Promise<void> {
    this.renderChrome();
    await this.mount(this.active);
  }

  async onClose(): Promise<void> {
    await this.teardownMounted();
    this.contentEl.empty();
  }

  // Builds the two-pane layout: sidebar nav on the left, a host div on the
  // right that will receive the embedded view's DOM. The shell's contentEl
  // gets a marker class (`dp-shell-root`) that zeroes its padding and turns
  // it into a positioning context; the actual app (`dp-shell-app`) is a
  // child div that fills the contentEl absolutely. Avoids height-resolution
  // surprises across themes where contentEl's own height isn't a defined
  // flex context.
  private renderChrome(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass("dp-shell-root");

    const app = root.createDiv({ cls: "dp-shell-app" });

    const sidebar = app.createDiv({ cls: "dp-shell-sidebar" });
    sidebar.createDiv({
      cls: "dp-shell-sidebar-header",
      text: "Today",
    });

    this.navItemsEl = sidebar.createDiv({ cls: "dp-shell-sidebar-items" });
    this.renderNav();

    const host = app.createDiv({ cls: "dp-shell-host" });
    // The embedded view's render code reads `containerEl.children[1]` as its
    // render root, so the host needs at least two children. children[0] is a
    // hidden stub that stands in for the leaf header ItemView normally puts
    // at children[0]; children[1] is where the view paints. The stub uses
    // `display: none` so it doesn't take layout space but is still indexable
    // via `.children`.
    host.createDiv({ cls: "dp-shell-host-stub" });
    host.createDiv({ cls: "dp-shell-host-content" });
    this.hostEl = host;
  }

  private renderNav(): void {
    const items = this.navItemsEl;
    if (!items) return;
    items.empty();
    for (const entry of ENTRIES) {
      const row = items.createDiv({ cls: "dp-shell-nav-item" });
      if (entry.target === this.active) row.addClass("is-active");
      const iconEl = row.createSpan({ cls: "dp-shell-nav-icon" });
      setIcon(iconEl, entry.icon);
      const text = row.createDiv({ cls: "dp-shell-nav-text" });
      text.createDiv({ cls: "dp-shell-nav-label", text: entry.label });
      text.createDiv({ cls: "dp-shell-nav-desc", text: entry.description });
      row.addEventListener("click", () => void this.switchTo(entry.target));
    }
  }

  private async switchTo(target: ShellTarget): Promise<void> {
    if (this.mounted && this.mounted.target === target) return;
    this.active = target;
    this.renderNav();
    await this.mount(target);
  }

  // Tears down the previously-mounted view (if any) and mounts a fresh
  // instance for `target`. The new instance is constructed against
  // `this.leaf` (the shell's leaf) but has its containerEl/contentEl
  // pointed at the in-shell host so its render code paints inline.
  private async mount(target: ShellTarget): Promise<void> {
    await this.teardownMounted();
    const host = this.hostEl;
    if (!host) return;
    const view = this.constructView(target);
    // Override the view's element references *before* onOpen runs so its
    // render code sees our host. Casts because containerEl/contentEl are
    // declared readonly-ish on the type but writable at runtime.
    (view as unknown as { containerEl: HTMLElement }).containerEl = host;
    const contentChild = host.children[1] as HTMLElement;
    (view as unknown as { contentEl: HTMLElement }).contentEl = contentChild;
    // Adding as a child component triggers `view.load()` so events the view
    // registers via `registerEvent` / `registerInterval` clean up when the
    // shell unloads (or when we swap views).
    this.addChild(view);
    await view.onOpen();
    this.mounted = { target, view };
  }

  private constructView(target: ShellTarget): ItemView {
    if (target === "today") return new TodayView(this.leaf, this.plugin);
    if (target === "week") return new MultiDayView(this.leaf, this.plugin);
    return new HabitsStatsView(this.leaf, this.plugin);
  }

  private async teardownMounted(): Promise<void> {
    if (!this.mounted) return;
    const { view } = this.mounted;
    try {
      await view.onClose();
    } catch {
      // Swallow — the view may have already cleaned itself up.
    }
    this.removeChild(view);
    const host = this.hostEl;
    if (host) {
      const content = host.children[1] as HTMLElement | undefined;
      if (content) content.empty();
    }
    this.mounted = null;
  }
}

// Returns whether a leaf identifier refers to one of the embedded shell
// target views. Other modules use this to decide whether opening a target
// view standalone is preferable to routing through the shell.
export function isShellEmbeddable(viewType: string): boolean {
  return (
    viewType === VIEW_TYPE_TODAY ||
    viewType === VIEW_TYPE_MULTI_DAY ||
    viewType === VIEW_TYPE_HABITS_STATS
  );
}
