<script lang="ts">
  import type TodayPlugin from "../main";
  import { addDays, startOfDay } from "../dailyNote";
  import {
    loadDayWindow,
    loadInboxTasks,
    summarizeWindow,
    buildWindowColorMap,
    type DayBundle,
    type InboxBundle,
  } from "../multiDay";
  import type { ParsedTask } from "../parser";
  import SummaryBar from "./SummaryBar.svelte";
  import InboxPanel from "./InboxPanel.svelte";
  import DayGrid from "./DayGrid.svelte";

  interface Props {
    plugin: TodayPlugin;
    registerRefresh: (fn: () => void) => void;
    popOut: () => void;
  }

  let { plugin, registerRefresh, popOut }: Props = $props();

  let anchor = $state<Date>(startOfDay(new Date()));
  // svelte-ignore state_referenced_locally
  let count = $state<number>(plugin.settings.multiDayCount ?? 7);
  let days = $state<DayBundle[]>([]);
  let inbox = $state<InboxBundle>({ path: "", file: null, tasks: [] });
  let loading = $state<boolean>(true);

  // The summary + color map are derived from whatever data we last loaded.
  // Keeping them as $derived means they recompute automatically when days /
  // inbox change without an explicit refresh in each spot that mutates state.
  const summary = $derived(
    summarizeWindow(days, plugin.settings.projectColors),
  );
  const colorMap = $derived(
    buildWindowColorMap(days, inbox.tasks, plugin.settings.projectColors),
  );

  async function refresh() {
    loading = true;
    const [d, i] = await Promise.all([
      loadDayWindow(plugin.app, plugin.settings, anchor, count),
      loadInboxTasks(plugin.app, plugin.settings),
    ]);
    days = d;
    inbox = i;
    loading = false;
  }

  // svelte-ignore state_referenced_locally
  registerRefresh(refresh);

  $effect(() => {
    // Re-fetch whenever the visible window changes. Reading anchor + count
    // here registers the dependency.
    void anchor;
    void count;
    void refresh();
  });

  function shiftDays(delta: number) {
    anchor = addDays(anchor, delta);
  }

  function jumpToToday() {
    anchor = startOfDay(new Date());
  }

  async function setCount(n: number) {
    count = n;
    plugin.settings.multiDayCount = n;
    await plugin.saveSettings();
  }

  async function handleDropRefresh() {
    await refresh();
  }
</script>

<div class="dp-md-root">
  <div class="dp-md-header">
    <div class="dp-md-nav">
      <button
        class="dp-md-nav-btn"
        aria-label="Previous"
        onclick={() => shiftDays(-count)}
      >‹</button>
      <button class="dp-md-today-btn" onclick={jumpToToday}>Today</button>
      <button
        class="dp-md-nav-btn"
        aria-label="Next"
        onclick={() => shiftDays(count)}
      >›</button>
    </div>
    <div class="dp-md-header-actions">
      <div class="dp-md-count-toggle">
        <button
          class={"dp-md-count-btn" + (count === 3 ? " is-active" : "")}
          onclick={() => setCount(3)}
        >3</button>
        <button
          class={"dp-md-count-btn" + (count === 7 ? " is-active" : "")}
          onclick={() => setCount(7)}
        >7</button>
      </div>
      <button
        class="dp-md-popout-btn"
        aria-label="Pop out into separate window"
        title="Pop out into separate window"
        onclick={popOut}
      >⤢</button>
    </div>
  </div>

  <SummaryBar {summary} />

  <div class="dp-md-body">
    <InboxPanel
      {plugin}
      tasks={inbox.tasks}
      file={inbox.file}
      {colorMap}
    />
    <DayGrid
      {plugin}
      {days}
      {colorMap}
      inboxFile={inbox.file}
      onMoved={handleDropRefresh}
    />
  </div>

  {#if loading && days.length === 0}
    <div class="dp-md-loading">Loading…</div>
  {/if}
</div>
