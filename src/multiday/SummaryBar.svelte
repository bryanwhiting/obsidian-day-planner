<script lang="ts">
  import type { WindowSummary } from "../multiDay";

  interface Props {
    summary: WindowSummary;
  }

  let { summary }: Props = $props();

  function fmtMin(min: number): string {
    if (min <= 0) return "0m";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }
</script>

<div class="dp-md-summary">
  {#if summary.totalMin === 0}
    <div class="dp-md-summary-empty">No scheduled time in this window.</div>
  {:else}
    <div class="dp-md-summary-bar">
      {#each summary.byProject as p}
        <div
          class="dp-md-summary-seg"
          style:width="{(p.minutes / summary.totalMin) * 100}%"
          style:background={p.color}
          title="{p.project} · {fmtMin(p.minutes)}"
        ></div>
      {/each}
    </div>
    <div class="dp-md-summary-legend">
      <span class="dp-md-summary-total">{fmtMin(summary.totalMin)} total</span>
      {#each summary.byProject as p}
        <span class="dp-md-summary-chip">
          <span class="dp-md-summary-dot" style:background={p.color}></span>
          <span class="dp-md-summary-name">{p.project}</span>
          <span class="dp-md-summary-min">{fmtMin(p.minutes)}</span>
        </span>
      {/each}
    </div>
  {/if}
</div>
