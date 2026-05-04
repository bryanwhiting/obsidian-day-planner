import { Plugin, WorkspaceLeaf } from "obsidian";
import { DayPlannerView, VIEW_TYPE_DAY_PLANNER } from "./view";
import {
  DayPlannerSettings,
  DayPlannerSettingTab,
  DEFAULT_SETTINGS,
} from "./settings";
import { DEFAULT_PREFIXES } from "./parser";

export default class DayPlannerPlugin extends Plugin {
  settings!: DayPlannerSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_DAY_PLANNER,
      (leaf) => new DayPlannerView(leaf, this),
    );

    this.addRibbonIcon("calendar-clock", "Open Day Planner", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-day-planner",
      name: "Open Day Planner",
      callback: () => void this.activateView(),
    });

    this.addSettingTab(new DayPlannerSettingTab(this.app, this));
  }

  async onunload(): Promise<void> {}

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<DayPlannerSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
      prefixes: { ...DEFAULT_PREFIXES, ...(data?.prefixes ?? {}) },
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(
      VIEW_TYPE_DAY_PLANNER,
    )) {
      const view = leaf.view as DayPlannerView;
      view.scheduleRender();
    }
  }

  async activateView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAY_PLANNER);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf: WorkspaceLeaf | null = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({
      type: VIEW_TYPE_DAY_PLANNER,
      active: true,
    });
    this.app.workspace.revealLeaf(leaf);
  }
}
