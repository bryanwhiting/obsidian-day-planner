<script lang="ts">
  import type TodayPlugin from "../main";
  import {
    formatClockShort,
    type ParsedTask,
  } from "../parser";
  import { layoutTimeline } from "../scheduler";
  import { colorFor } from "../multiDay";

  // Cap on how many overlapping tasks render side-by-side in a single day
  // column. With 7 columns onscreen, 3+ lanes shrink each block past the
  // point of legibility — overflow stacks visually instead.
  const MAX_LANES = 2;

  interface Props {
    plugin: TodayPlugin;
    tasks: ParsedTask[];
    colorMap: Map<string, string>;
    onClickTask: (task: ParsedTask) => void;
  }

  let { plugin, tasks, colorMap, onClickTask }: Props = $props();

  const startHour = $derived(plugin.settings.visibleStartHour ?? 6);
  const endHour = $derived(plugin.settings.visibleEndHour ?? 22);
  const startMin = $derived(startHour * 60);
  const endMin = $derived(endHour * 60);
  const totalMin = $derived(endMin - startMin);

  // Slightly compressed vs the main view (which uses 1 px/min) so 7 columns
  // fit on screen without scrolling. Bumped from the original 0.5 to keep
  // short blocks legible — at 0.5 a 30-min task was 15px tall, too tight.
  const PX_PER_MIN = 0.7;
  const heightPx = $derived(totalMin * PX_PER_MIN);

  const hourMarks = $derived.by(() => {
    const out: number[] = [];
    for (let h = startHour; h <= endHour; h++) out.push(h);
    return out;
  });

  const layout = $derived(
    layoutTimeline(tasks, startMin, PX_PER_MIN, MAX_LANES),
  );

  function hourTopPx(h: number): number {
    return (h * 60 - startMin) * PX_PER_MIN;
  }

  function bodyText(task: ParsedTask): string {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
</script>

<div class="dp-md-timeline" style:height="{heightPx}px">
  {#each hourMarks as h}
    <div class="dp-md-timeline-row" style:top="{hourTopPx(h)}px">
      <div class="dp-md-timeline-line"></div>
      <div class="dp-md-timeline-label">{formatClockShort(h * 60)}</div>
    </div>
  {/each}

  <div class="dp-md-timeline-blocks">
    {#each layout as b (b.task.lineNumber)}
      {@const color = colorFor(b.task, colorMap)}
      <button
        class={"dp-md-timeline-block" + (b.task.checked ? " is-done" : "")}
        style:top="{b.topPx}px"
        style:height="{Math.max(8, b.heightPx)}px"
        style:left="{b.leftPct}%"
        style:width="calc({b.widthPct}% - 2px)"
        style:--dp-md-color={color ?? "var(--color-accent)"}
        title={bodyText(b.task)}
        onclick={() => onClickTask(b.task)}
      >
        <span class="dp-md-timeline-block-text">{bodyText(b.task)}</span>
      </button>
    {/each}
  </div>
</div>
