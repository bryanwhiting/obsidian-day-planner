declare module "*.svelte" {
  import type { Component } from "svelte";
  const component: Component<Record<string, unknown>, Record<string, unknown>, string>;
  export default component;
}
