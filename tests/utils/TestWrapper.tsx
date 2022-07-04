import { defineComponent, PropType } from "vue";
import SchemaForm, { Schema, ThemeProvider } from "../../lib";
import theme from "../../lib/theme";

export const TestThemeProvider = defineComponent({
  setup(p, { slots }) {
    return () => <ThemeProvider theme={theme}>{slots.default && slots.default()}</ThemeProvider>;
  },
});

export default defineComponent({
  name: "TestWrapper",
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <TestThemeProvider>
        <SchemaForm {...props} />
      </TestThemeProvider>
    );
  },
});
