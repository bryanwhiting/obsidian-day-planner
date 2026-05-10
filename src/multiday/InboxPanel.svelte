<script lang="ts">
  import { TFile } from "obsidian";
  import type TodayPlugin from "../main";
  import type { ParsedTask } from "../parser";
  import { colorFor } from "../multiDay";
  import { setDrag } from "./dragStore";

  interface Props {
    plugin: TodayPlugin;
    tasks: ParsedTask[];
    file: TFile | null;
    colorMap: Map<string, string>;
  }

  let { plugin, tasks, file, colorMap }: Props = $props();

  function onDragStart(ev: DragEvent, task: ParsedTask) {
    if (!ev.dataTransfer) return;
    setDrag({ task, fromInbox: true });
    // Required for Firefox to actually fire dragstart; the value isn't read on
    // drop (we use the module-scoped DragState there).
    ev.dataTransfer.setData("text/plain", task.rawLine);
    ev.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd() {
    setDrag(null);
  }

  async function openTask(task: ParsedTask) {
    if (!file) return;
    const leaf = plugin.app.workspace.getLeaf(false);
    await leaf.openFile(file, {
      eState: { line: task.lineNumber },
    });
  }

  function bodyText(task: ParsedTask): string {
    return task.body.replace(/#\S+/g, "").trim() || task.body.trim();
  }
</script>

<div class="dp-md-inbox">
  <div class="dp-md-inbox-header">
    <span class="dp-md-inbox-title">Inbox</span>
    <span class="dp-md-inbox-count">{tasks.length}</span>
  </div>
  {#if !file}
    <div class="dp-md-inbox-empty">No inbox file at this path.</div>
  {:else if tasks.length === 0}
    <div class="dp-md-inbox-empty">Inbox is clear.</div>
  {:else}
    <ul class="dp-md-inbox-list">
      {#each tasks as task (task.lineNumber)}
        {@const color = colorFor(task, colorMap)}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          class="dp-md-inbox-item"
          draggable={true}
          ondragstart={(ev) => onDragStart(ev, task)}
          ondragend={onDragEnd}
          onclick={() => openTask(task)}
        >
          <span
            class="dp-md-inbox-dot"
            style:background={color ?? "transparent"}
            style:border-color={color ?? "var(--background-modifier-border)"}
          ></span>
          <span class="dp-md-inbox-text">{bodyText(task)}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
