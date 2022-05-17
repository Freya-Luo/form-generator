import { defineComponent, h } from "vue";

export default defineComponent({
  setup(p, { slots }) {
    return () => h("div", "schema form here!");
  },
});
