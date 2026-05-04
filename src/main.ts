import { Plugin, WorkspaceLeaf } from "obsidian";
import { TodayView, VIEW_TYPE_TODAY } from "./view";
import {
  TodaySettings,
  TodaySettingTab,
  DEFAULT_SETTINGS,
} from "./settings";
import { DEFAULT_PREFIXES } from "./parser";

export default class TodayPlugin extends Plugin {
  settings!: TodaySettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_TODAY,
      (leaf) => new TodayView(leaf, this),
    );

    this.addRibbonIcon("calendar-clock", "Open Today", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-today",
      name: "Open Today",
      callback: () => void this.activateView(),
    });

    this.addCommand({
      id: "open-calendar",
      name: "Open calendar",
      callback: () => void this.activateView({ openCalendar: true }),
    });

    this.addSettingTab(new TodaySettingTab(this.app, this));
  }

  async onunload(): Promise<void> {}

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<TodaySettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
      prefixes: { ...DEFAULT_PREFIXES, ...(data?.prefixes ?? {}) },
      projectColors: Array.isArray(data?.projectColors)
        ? data!.projectColors!.filter(
            (c) => c && typeof c.project === "string" && typeof c.color === "string",
          )
        : [],
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(
      VIEW_TYPE_TODAY,
    )) {
      const view = leaf.view as TodayView;
      view.scheduleRender();
    }
  }

  async activateView(opts: { openCalendar?: boolean } = {}): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_TODAY);
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
    } else {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({
        type: VIEW_TYPE_TODAY,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    }
    if (opts.openCalendar && leaf.view instanceof TodayView) {
      leaf.view.openCalendar();
    }
  }
}
