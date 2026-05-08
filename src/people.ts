import { App, TFile } from "obsidian";

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
