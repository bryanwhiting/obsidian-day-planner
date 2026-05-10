<script lang="ts">
  import type { TFile } from "obsidian";
  import type TodayPlugin from "../main";
  import type { DayBundle } from "../multiDay";
  import DayColumn from "./DayColumn.svelte";

  interface Props {
    plugin: TodayPlugin;
    days: DayBundle[];
    colorMap: Map<string, string>;
    inboxFile: TFile | null;
    onMoved: () => void | Promise<void>;
  }

  let { plugin, days, colorMap, inboxFile, onMoved }: Props = $props();
</script>

<div class="dp-md-grid" style:grid-template-columns="repeat({days.length}, minmax(0, 1fr))">
  {#each days as day (day.path)}
    <DayColumn
      {plugin}
      {day}
      {colorMap}
      {inboxFile}
      {onMoved}
    />
  {/each}
</div>
