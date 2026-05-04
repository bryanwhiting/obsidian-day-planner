import { App, PluginSettingTab, Setting } from "obsidian";
import type DayPlannerPlugin from "./main";
import { TagPrefixes, DEFAULT_PREFIXES } from "./parser";

export interface DayPlannerSettings {
  visibleStartHour: number;
  visibleEndHour: number;
  snapMin: number;
  pxPerMin: number;
  prefixes: TagPrefixes;
  dailyNoteFormatFallback: string;
  dailyNoteFolderFallback: string;
}

export const DEFAULT_SETTINGS: DayPlannerSettings = {
  visibleStartHour: 6,
  visibleEndHour: 23,
  snapMin: 15,
  pxPerMin: 1,
  prefixes: { ...DEFAULT_PREFIXES },
  dailyNoteFormatFallback: "YYYY-MM-DD",
  dailyNoteFolderFallback: "daily",
};

export class DayPlannerSettingTab extends PluginSettingTab {
  plugin: DayPlannerPlugin;

  constructor(app: App, plugin: DayPlannerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Visible start hour")
      .setDesc("First hour shown on the timeline (0-23).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.visibleStartHour.toString())
          .onChange(async (v) => {
            const n = clampInt(v, 0, 23, this.plugin.settings.visibleStartHour);
            this.plugin.settings.visibleStartHour = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Visible end hour")
      .setDesc("Last hour shown (1-24, must exceed start).")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.visibleEndHour.toString())
          .onChange(async (v) => {
            const n = clampInt(v, 1, 24, this.plugin.settings.visibleEndHour);
            this.plugin.settings.visibleEndHour = n;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Snap interval (minutes)")
      .setDesc("Drag-drop snaps to this granularity.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.snapMin.toString())
          .onChange(async (v) => {
            this.plugin.settings.snapMin = clampInt(
              v,
              1,
              60,
              this.plugin.settings.snapMin,
            );
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Pixels per minute")
      .setDesc("Vertical scale of the timeline.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.pxPerMin.toString())
          .onChange(async (v) => {
            const n = parseFloat(v);
            if (!isNaN(n) && n > 0 && n <= 10) {
              this.plugin.settings.pxPerMin = n;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Duration tag prefix")
      .setDesc("Default 'd' → #d/90m.")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.prefixes.duration)
          .onChange(async (v) => {
            if (/^[a-zA-Z]+$/.test(v)) {
              this.plugin.settings.prefixes.duration = v;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Time tag prefix")
      .setDesc("Default 'h' → #h/10a.")
      .addText((t) =>
        t.setValue(this.plugin.settings.prefixes.time).onChange(async (v) => {
          if (/^[a-zA-Z]+$/.test(v)) {
            this.plugin.settings.prefixes.time = v;
            await this.plugin.saveSettings();
          }
        }),
      );

    new Setting(containerEl)
      .setName("Order tag prefix")
      .setDesc("Default 'o' → #o/3 (used for unscheduled drag-reorder).")
      .addText((t) =>
        t.setValue(this.plugin.settings.prefixes.order).onChange(async (v) => {
          if (/^[a-zA-Z]+$/.test(v)) {
            this.plugin.settings.prefixes.order = v;
            await this.plugin.saveSettings();
          }
        }),
      );

    new Setting(containerEl)
      .setName("Daily note format fallback")
      .setDesc(
        "Used if the core Daily Notes plugin isn't enabled. Tokens: YYYY MM DD.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.dailyNoteFormatFallback)
          .onChange(async (v) => {
            if (v.trim()) {
              this.plugin.settings.dailyNoteFormatFallback = v.trim();
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Daily note folder fallback")
      .setDesc(
        "Folder for newly created daily notes when navigating dates. Used if the core Daily Notes plugin isn't enabled.",
      )
      .addText((t) =>
        t
          .setValue(this.plugin.settings.dailyNoteFolderFallback)
          .onChange(async (v) => {
            this.plugin.settings.dailyNoteFolderFallback = v.trim();
            await this.plugin.saveSettings();
          }),
      );
  }
}

function clampInt(v: string, lo: number, hi: number, fallback: number): number {
  const n = parseInt(v, 10);
  if (isNaN(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}
