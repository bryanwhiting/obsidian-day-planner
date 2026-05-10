<script lang="ts">
  import { TFile } from "obsidian";
  import type TodayPlugin from "../main";
  import type { ParsedTask } from "../parser";
  import {
    type DayBundle,
    buildFallback,
    colorFor,
  } from "../multiDay";
  import { sameDay } from "../dailyNote";
  import { moveTaskBetweenDailyNotes } from "../taskMove";
  import { getDrag } from "./dragStore";
  import MiniTimeline from "./MiniTimeline.svelte";

  interface Props {
    plugin: TodayPlugin;
    day: DayBundle;
    colorMap: Map<string, string>;
    inboxFile: TFile | null;
    onMoved: () => void | Promise<void>;
  }

  let { plugin, day, colorMap, inboxFile, onMoved }: Props = $props();

  let dragOver = $state(false);

  const isToday = $derived(sameDay(day.date, new Date()));

  const scheduled = $derived(day.tasks.filter((t) => t.startMin !== null));
  const unscheduled = $derived(day.tasks.filter((t) => t.startMin === null));

  function fmtHeader(d: Date): string {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  async function openDay(ev: MouseEvent) {
    ev.preventDefault();
    if (day.file) {
      const leaf = plugin.app.workspace.getLeaf(false);
      await leaf.openFile(day.file);
    } else {
      // No file yet; open via path so Obsidian creates+resolves it normally.
      await plugin.app.workspace.openLinkText(day.path, "");
    }
  }

  async function openTask(task: ParsedTask) {
    if (!day.file) return;
    const leaf = plugin.app.workspace.getLeaf(false);
    await leaf.openFile(day.file, { eState: { line: task.lineNumber } });
  }

  function onDragOver(ev: DragEvent) {
    const drag = getDrag();
    if (!drag || !drag.fromInbox) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
    dragOver = true;
  }

  function onDragLeave() {
    dragOver = false;
  }

  async function onDrop(ev: DragEvent) {
    ev.preventDefault();
    dragOver = false;
    const drag = getDrag();
    if (!drag || !drag.fromInbox) return;
    if (!inboxFile) return;
    const fallback = buildFallback(plugin.settings);
    await moveTaskBetweenDailyNotes(
      plugin.app,
      inboxFile,
      drag.task,
      day.date,
      fallback,
    );
    await onMoved();
  }

  function bodyText(task: ParsedTask): string {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
</script>

<div
  class={"dp-md-day" + (isToday ? " is-today" : "") + (dragOver ? " is-drop-target" : "")}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
  role="region"
  aria-label="Day column"
>
  <div class="dp-md-day-header">
    <a
      class="dp-md-day-link"
      href="#"
      onclick={openDay}
    >{fmtHeader(day.date)}</a>
    <span class="dp-md-day-count">{day.tasks.length}</span>
  </div>

  <MiniTimeline
    plugin={plugin}
    tasks={scheduled}
    {colorMap}
    onClickTask={openTask}
  />

  <div class="dp-md-unsched">
    {#if unscheduled.length === 0}
      <div class="dp-md-unsched-empty">—</div>
    {:else}
      <ul class="dp-md-unsched-list">
        {#each unscheduled as task (task.lineNumber)}
          {@const color = colorFor(task, colorMap)}
          <li
            class={"dp-md-unsched-item" + (task.checked ? " is-done" : "")}
            onclick={() => openTask(task)}
          >
            <span
              class="dp-md-unsched-dot"
              style:background={color ?? "transparent"}
              style:border-color={color ?? "var(--background-modifier-border)"}
            ></span>
            <span class="dp-md-unsched-text">{bodyText(task)}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
