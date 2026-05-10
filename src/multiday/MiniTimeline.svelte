<script lang="ts">
  import type TodayPlugin from "../main";
  import type { ParsedTask } from "../parser";
  import { colorFor } from "../multiDay";

  interface Props {
    plugin: TodayPlugin;
    tasks: ParsedTask[];
    colorMap: Map<string, string>;
    onClickTask: (task: ParsedTask) => void;
  }

  let { plugin, tasks, colorMap, onClickTask }: Props = $props();

  // Reuse the user's configured visible window. The mini timeline is read-only
  // so we don't need the more elaborate "current-time-following" logic from
  // the main view — just clamp blocks to this window.
  const startHour = $derived(plugin.settings.visibleStartHour ?? 6);
  const endHour = $derived(plugin.settings.visibleEndHour ?? 22);
  const startMin = $derived(startHour * 60);
  const endMin = $derived(endHour * 60);
  const totalMin = $derived(endMin - startMin);

  // 1px-per-min would make 16 hours = 960px. Compress to ~0.5px/min so a
  // 16-hour day is ~480px tall — fits without scrolling on most layouts.
  const PX_PER_MIN = 0.5;
  const heightPx = $derived(totalMin * PX_PER_MIN);

  const hourMarks = $derived.by(() => {
    const out: number[] = [];
    for (let h = startHour; h <= endHour; h++) out.push(h);
    return out;
  });

  function blockTop(task: ParsedTask): number {
    const s = task.startMin ?? startMin;
    return Math.max(0, (s - startMin) * PX_PER_MIN);
  }

  function blockHeight(task: ParsedTask): number {
    const s = task.startMin ?? startMin;
    const end = Math.min(endMin, s + task.durationMin);
    return Math.max(8, (end - Math.max(startMin, s)) * PX_PER_MIN);
  }

  function fmtClock(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const hh = ((h + 11) % 12) + 1;
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function bodyText(task: ParsedTask): string {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
</script>

<div class="dp-md-timeline" style:height="{heightPx}px">
  {#each hourMarks as h}
    <div
      class="dp-md-timeline-hour"
      style:top="{(h * 60 - startMin) * PX_PER_MIN}px"
    >
      <span class="dp-md-timeline-hour-label">{h}</span>
    </div>
  {/each}

  {#each tasks as task (task.lineNumber)}
    {@const color = colorFor(task, colorMap)}
    {@const top = blockTop(task)}
    {@const height = blockHeight(task)}
    <button
      class={"dp-md-timeline-block" + (task.checked ? " is-done" : "")}
      style:top="{top}px"
      style:height="{height}px"
      style:background={color ?? "var(--background-modifier-border)"}
      title="{fmtClock(task.startMin ?? 0)} · {bodyText(task)}"
      onclick={() => onClickTask(task)}
    >
      <span class="dp-md-timeline-block-text">{bodyText(task)}</span>
    </button>
  {/each}
</div>
