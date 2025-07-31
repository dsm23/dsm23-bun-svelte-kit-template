<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Page from "./Page.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "Example/Page",
    component: Page,
    parameters: {
      // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
      layout: "fullscreen",
    },
  });
</script>

<Story name="Logged In" />

<Story name="Logged Out" />
