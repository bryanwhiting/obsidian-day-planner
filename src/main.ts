import {
  Editor,
  EditorPosition,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
  Platform,
  Plugin,
  TFile,
  WorkspaceLeaf,
} from "obsidian";
import { polyfill as mobileDragDropPolyfill } from "mobile-drag-drop";
import { TodayView, VIEW_TYPE_TODAY } from "./view";
import {
  TodaySettings,
  TodaySettingTab,
  DEFAULT_SETTINGS,
  DEFAULT_AUTOCOMPLETE,
} from "./settings";
import { DEFAULT_PREFIXES } from "./parser";

let polyfillInstalled = false;

export default class TodayPlugin extends Plugin {
  settings!: TodaySettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    // HTML5 drag-and-drop doesn't fire on touch — install the polyfill once
    // on mobile so timeline blocks and unscheduled cards become draggable.
    // `holdToDrag` keeps tap-to-open intact (drag only after a brief press).
    if (Platform.isMobile && !polyfillInstalled) {
      mobileDragDropPolyfill({ holdToDrag: 200 });
      polyfillInstalled = true;
    }

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
    this.registerEditorSuggest(new ProjectEditorSuggest(this));
  }

  async onunload(): Promise<void> {}

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<TodaySettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data ?? {}),
      prefixes: { ...DEFAULT_PREFIXES, ...(data?.prefixes ?? {}) },
      autocomplete: {
        ...DEFAULT_AUTOCOMPLETE,
        ...(data?.autocomplete ?? {}),
      },
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

// In-editor suggest for the project trigger (default "##"). Triggers when the
// configured string appears mid-line preceded by some non-whitespace content,
// so plain markdown headings ("## My heading" at column 0) are left alone.
// Selecting a suggestion replaces the trigger + query with "#<projectPrefix>/<name> ".
class ProjectEditorSuggest extends EditorSuggest<string> {
  private plugin: TodayPlugin;

  constructor(plugin: TodayPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  onTrigger(
    cursor: EditorPosition,
    editor: Editor,
    _file: TFile | null,
  ): EditorSuggestTriggerInfo | null {
    const trigger = this.plugin.settings.autocomplete.projectTrigger;
    if (!trigger) return null;
    const line = editor.getLine(cursor.line);
    const before = line.slice(0, cursor.ch);
    const idx = before.lastIndexOf(trigger);
    if (idx < 0) return null;
    // Require non-whitespace earlier on the line so "## heading" at column 0
    // never opens the picker.
    if (!/\S/.test(before.slice(0, idx))) return null;
    const query = before.slice(idx + trigger.length);
    // Whitespace or a "#" terminates the query — bail so the popover closes
    // once the user moves on.
    if (/[\s#]/.test(query)) return null;
    return {
      start: { line: cursor.line, ch: idx },
      end: cursor,
      query,
    };
  }

  getSuggestions(ctx: EditorSuggestContext): string[] {
    const projects = this.collectProjects();
    const q = ctx.query.trim().toLowerCase();
    if (!q) return projects.slice(0, 12);
    const starts = projects.filter((p) => p.toLowerCase().startsWith(q));
    const contains = projects.filter(
      (p) =>
        !p.toLowerCase().startsWith(q) && p.toLowerCase().includes(q),
    );
    return [...starts, ...contains].slice(0, 12);
  }

  renderSuggestion(name: string, el: HTMLElement): void {
    el.addClass("dp-project-suggest-item");
    const slash = name.indexOf("/");
    if (slash >= 0) {
      el.createSpan({ text: name.slice(0, slash) });
      el.createSpan({
        cls: "dp-project-suggest-sub",
        text: name.slice(slash),
      });
    } else {
      el.createSpan({ text: name });
    }
  }

  selectSuggestion(name: string, _evt: MouseEvent | KeyboardEvent): void {
    if (!this.context) return;
    const editor = this.context.editor;
    const prefix = this.plugin.settings.prefixes.project;
    editor.replaceRange(
      `#${prefix}/${name} `,
      this.context.start,
      this.context.end,
    );
    this.close();
  }

  private collectProjects(): string[] {
    const prefix = `#${this.plugin.settings.prefixes.project}/`.toLowerCase();
    const names = new Set<string>();
    const cache = this.app.metadataCache as unknown as {
      getTags?: () => Record<string, number>;
    };
    const tags = cache.getTags?.() ?? {};
    for (const tag of Object.keys(tags)) {
      if (tag.toLowerCase().startsWith(prefix)) {
        const name = tag.slice(prefix.length);
        if (name) names.add(name);
      }
    }
    for (const pc of this.plugin.settings.projectColors) {
      if (pc.project) names.add(pc.project);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }
}
