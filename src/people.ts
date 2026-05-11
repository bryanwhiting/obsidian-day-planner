import { App, Notice, TFile } from "obsidian";

// One entry returned by buildPeopleSuggestions. `path` is the full vault path
// (used as a stable key when mixing with date suggestions); `basename` and
// `folder` drive the popover rendering.
export interface PersonSuggestion {
  basename: string;
  path: string;
  folder: string;
}

// Returns markdown files inside `folder` whose basename matches `query`. The
// filter is the same starts-with-first/contains-after pattern as the other
// inline suggesters, capped at `limit`. An empty folder string disables the
// feature (returns []), so the @-trigger picker still works for users who
// haven't configured a people folder.
export function buildPeopleSuggestions(
  app: App,
  folder: string,
  query: string,
  limit = 12,
): PersonSuggestion[] {
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  if (!cleanFolder) return [];
  const folderLc = cleanFolder.toLowerCase();
  const files = app.vault.getMarkdownFiles().filter((f) => {
    const dir = (f.parent?.path || "").toLowerCase();
    return dir === folderLc || dir.startsWith(folderLc + "/");
  });
  const q = query.trim().toLowerCase();
  const ranked: TFile[] = q
    ? [
        ...files.filter((f) => f.basename.toLowerCase().startsWith(q)),
        ...files.filter(
          (f) =>
            !f.basename.toLowerCase().startsWith(q) &&
            f.basename.toLowerCase().includes(q),
        ),
      ]
    : files.slice().sort((a, b) => a.basename.localeCompare(b.basename));
  return ranked.slice(0, limit).map((f) => ({
    basename: f.basename,
    path: f.path,
    folder: f.parent?.path || "",
  }));
}

// Strips characters that aren't valid in a vault filename. Keeps spaces and
// most punctuation Obsidian itself tolerates; replaces the obvious offenders
// (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`) with `-`. Also collapses
// repeated whitespace and trims edges so "Jane   Doe" → "Jane Doe".
export function sanitizePersonName(raw: string): string {
  return raw
    .replace(/[\/\\:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

// Returns the existing person file whose basename matches `name`
// (case-insensitive), or null. Used by the autocomplete to decide whether
// "Create new person: X" is offered.
export function findPersonByName(
  app: App,
  folder: string,
  name: string,
): TFile | null {
  const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
  if (!cleanFolder || !name.trim()) return null;
  const folderLc = cleanFolder.toLowerCase();
  const target = name.trim().toLowerCase();
  for (const f of app.vault.getMarkdownFiles()) {
    const dir = (f.parent?.path || "").toLowerCase();
    const inFolder = dir === folderLc || dir.startsWith(folderLc + "/");
    if (inFolder && f.basename.toLowerCase() === target) return f;
  }
  return null;
}

interface CreatePersonOptions {
  folder: string;
  name: string;
  // Frontmatter keys to seed in the new note when no template is configured.
  // Each becomes an empty `key: ` line in the auto-stub. Duplicates and empty
  // keys are dropped.
  seedFields: string[];
  // Optional vault path to a template file. When present and readable, the
  // file's contents become the new note (with `{{name}}` / `{{date}}`
  // substituted). Falls back to the auto-stub when the path is empty or the
  // file can't be found.
  templatePath?: string;
}

// Creates `<folder>/<name>.md` with either a configured template (read from
// `templatePath` and expanded for `{{name}}` / `{{date}}`) or a minimal
// frontmatter stub seeded from `seedFields`. If the file already exists it's
// returned as-is. Surfaces a Notice on creation.
export async function createPerson(
  app: App,
  opts: CreatePersonOptions,
): Promise<TFile | null> {
  const cleanFolder = (opts.folder || "").replace(/^\/+|\/+$/g, "");
  const cleanName = sanitizePersonName(opts.name);
  if (!cleanFolder || !cleanName) return null;
  const folderExists = app.vault.getAbstractFileByPath(cleanFolder);
  if (!folderExists) {
    try {
      await app.vault.createFolder(cleanFolder);
    } catch {
      // Folder may have been created between the check and now — fine.
    }
  }
  const path = `${cleanFolder}/${cleanName}.md`;
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing instanceof TFile) return existing;
  const content = await buildPersonContent(app, cleanName, opts);
  const file = await app.vault.create(path, content);
  new Notice(`Created ${path}`);
  return file;
}

async function buildPersonContent(
  app: App,
  cleanName: string,
  opts: CreatePersonOptions,
): Promise<string> {
  const tplPath = (opts.templatePath || "").trim();
  if (tplPath) {
    const tplFile = app.vault.getAbstractFileByPath(tplPath);
    if (tplFile instanceof TFile) {
      const raw = await app.vault.read(tplFile);
      return expandPersonTemplate(raw, cleanName);
    }
    new Notice(`Person template not found: ${tplPath} — using default stub`);
  }
  return buildAutoStub(opts.seedFields);
}

// Substitutes the supported placeholders in a person template:
//   {{name}}  -> the new person's basename (already sanitized)
//   {{date}}  -> today's date as YYYY-MM-DD
// Unknown placeholders are left untouched so users can fill them in manually
// or with another plugin.
export function expandPersonTemplate(raw: string, name: string): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;
  return raw
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{date\}\}/g, dateStr);
}

function buildAutoStub(seedFields: string[]): string {
  const seen = new Set<string>();
  const fmLines: string[] = [];
  for (const raw of seedFields) {
    const key = (raw || "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    fmLines.push(`${key}: `);
  }
  return fmLines.length > 0 ? `---\n${fmLines.join("\n")}\n---\n` : "";
}

// Builds the inline replacement string for a picked person. Mirrors
// buildDateLinkInsert: honors the "Use [[Wikilinks]]" toggle and falls back
// to the bare basename for wiki links so the inserted text matches what users
// already type by hand.
export function buildPersonLinkInsert(app: App, path: string): string {
  const basename = (path.split("/").pop() || path).replace(/\.md$/i, "");
  const useMd =
    (app.vault as unknown as {
      getConfig?: (key: string) => unknown;
    }).getConfig?.("useMarkdownLinks") === true;
  if (useMd) {
    const url = encodeURI(path);
    return `[${basename}](${url})`;
  }
  return `[[${basename}]]`;
}
