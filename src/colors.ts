export interface ProjectColor {
  project: string;
  color: string;
  // Optional Lucide icon name (e.g. "briefcase", "users"). Rendered next to
  // the project label wherever projects appear.
  icon?: string;
}

export interface ContextTag {
  // Bare hashtag without the leading `#` (e.g. "meeting", "walking"). Matched
  // literally as `#<tag>` against task bodies.
  tag: string;
  color: string;
  icon: string;
}

export const DEFAULT_PALETTE: string[] = [
  "#5B8DEF",
  "#3FB68B",
  "#E07A5F",
  "#9C6ADE",
  "#E8A23C",
  "#3DB5A8",
  "#D85F8C",
  "#7B8794",
  "#C77E2A",
  "#5DA3B5",
  "#A4985E",
  "#B25DA8",
];

export function resolveProjectColors(
  tasks: Iterable<{ project: string; subproject?: string | null }>,
  userMappings: ProjectColor[],
  palette: string[] = DEFAULT_PALETTE,
): Map<string, string> {
  // Returns a map keyed by either "<project>" or "<project>/<subproject>".
  // Top-level projects always get an entry (user-pinned or auto-assigned).
  // Sub-projects only appear when the user has pinned a color to that exact
  // "project/subproject" pair — otherwise callers fall back to the parent
  // project's color via getTaskColor().
  const result = new Map<string, string>();
  const userMap = new Map<string, string>();
  for (const m of userMappings) {
    const key = m.project?.trim();
    const color = m.color?.trim();
    if (key && color) userMap.set(key.toLowerCase(), color);
  }

  const projectsFromTasks: string[] = [];
  const subKeysFromTasks: string[] = [];
  const seenProj = new Set<string>();
  const seenSub = new Set<string>();
  for (const t of tasks) {
    if (!t.project) continue;
    if (!seenProj.has(t.project)) {
      seenProj.add(t.project);
      projectsFromTasks.push(t.project);
    }
    if (t.subproject) {
      const k = `${t.project}/${t.subproject}`;
      if (!seenSub.has(k)) {
        seenSub.add(k);
        subKeysFromTasks.push(k);
      }
    }
  }

  const userColorsUsed = new Set<string>();

  for (const proj of projectsFromTasks) {
    const userColor = userMap.get(proj.toLowerCase());
    if (userColor) {
      result.set(proj, userColor);
      userColorsUsed.add(userColor.toLowerCase());
    }
  }

  for (const subKey of subKeysFromTasks) {
    const userColor = userMap.get(subKey.toLowerCase());
    if (userColor) {
      result.set(subKey, userColor);
      userColorsUsed.add(userColor.toLowerCase());
    }
  }

  const remaining = projectsFromTasks
    .filter((p) => !userMap.has(p.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  const available = palette.filter(
    (c) => !userColorsUsed.has(c.toLowerCase()),
  );
  const pool = available.length > 0 ? available : palette;
  remaining.forEach((proj, i) => {
    result.set(proj, pool[i % pool.length]);
  });
  return result;
}

// Look up a task's color, honoring sub-project overrides while falling back
// to the parent project's color (which is itself either user-pinned or
// auto-assigned). Returns null when the task has no project at all.
export function getTaskColor(
  project: string | null | undefined,
  subproject: string | null | undefined,
  colorMap: Map<string, string>,
): string | null {
  if (!project) return null;
  if (subproject) {
    const sub = colorMap.get(`${project}/${subproject}`);
    if (sub) return sub;
  }
  return colorMap.get(project) ?? null;
}

export function contrastingTextColor(hex: string): string {
  const c = parseHex(hex);
  if (!c) return "#ffffff";
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  return L > 0.55 ? "#1a1a1a" : "#ffffff";
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let s = m[1];
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

export function isValidHex(hex: string): boolean {
  return parseHex(hex) !== null;
}
