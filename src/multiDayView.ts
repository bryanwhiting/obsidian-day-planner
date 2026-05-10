import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import type TodayPlugin from "./main";
import MultiDayApp from "./multiday/MultiDayApp.svelte";

export const VIEW_TYPE_MULTI_DAY = "today-multi-day";

export class MultiDayView extends ItemView {
  plugin: TodayPlugin;
  private app$: ReturnType<typeof mount> | null = null;
  private rerenderTimer: number | null = null;
  private refreshFn: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: TodayPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_MULTI_DAY;
  }

  getDisplayText(): string {
    return "Multi-day view";
  }

  getIcon(): string {
    return "calendar-range";
  }

  async onOpen(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("today-root");
    root.addClass("dp-multiday");

    this.app$ = mount(MultiDayApp, {
      target: root,
      props: {
        plugin: this.plugin,
        registerRefresh: (fn: () => void) => {
          this.refreshFn = fn;
        },
      },
    });

    this.registerEvent(
      this.app.vault.on("modify", () => this.scheduleRefresh()),
    );
    this.registerEvent(
      this.app.vault.on("delete", () => this.scheduleRefresh()),
    );
    this.registerEvent(
      this.app.vault.on("create", () => this.scheduleRefresh()),
    );
  }

  async onClose(): Promise<void> {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
    if (this.app$) {
      unmount(this.app$);
      this.app$ = null;
    }
  }

  private scheduleRefresh(): void {
    if (this.rerenderTimer !== null) window.clearTimeout(this.rerenderTimer);
    this.rerenderTimer = window.setTimeout(() => {
      this.rerenderTimer = null;
      this.refreshFn?.();
    }, 100);
  }
}
