import { Plugin, WorkspaceLeaf } from "obsidian";
import { DailyNotesPlannerView, VIEW_TYPE_DAILY_NOTES_PLANNER } from "./view";
import {
  DailyNotesPlannerSettings,
  DailyNotesPlannerSettingTab,
  DEFAULT_SETTINGS,
} from "./settings";
import { DEFAULT_PREFIXES } from "./parser";

export default class DailyNotesPlannerPlugin extends Plugin {
  settings!: DailyNotesPlannerSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_DAILY_NOTES_PLANNER,
      (leaf) => new DailyNotesPlannerView(leaf, this),
    );

    this.addRibbonIcon("calendar-clock", "Open Daily Notes Planner", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-daily-notes-planner",
      name: "Open Daily Notes Planner",
      callback: () => void this.activateView(),
    });

    this.addCommand({
      id: "open-calendar",
      name: "Open Calendar",
      callback: () => void this.activateView({ openCalendar: true }),
    });

    this.addSettingTab(new DailyNotesPlannerSettingTab(this.app, this));
  }

  async onunload(): Promise<void> {}

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<DailyNotesPlannerSettings> | null;
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
      VIEW_TYPE_DAILY_NOTES_PLANNER,
    )) {
      const view = leaf.view as DailyNotesPlannerView;
      view.scheduleRender();
    }
  }

  async activateView(opts: { openCalendar?: boolean } = {}): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_DAILY_NOTES_PLANNER);
    let leaf: WorkspaceLeaf | null;
    if (existing.length > 0) {
      leaf = existing[0];
      this.app.workspace.revealLeaf(leaf);
    } else {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({
        type: VIEW_TYPE_DAILY_NOTES_PLANNER,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    }
    if (opts.openCalendar && leaf.view instanceof DailyNotesPlannerView) {
      leaf.view.openCalendar();
    }
  }
}
