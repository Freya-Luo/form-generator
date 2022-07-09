import { defineComponent, PropType, provide } from "vue";
import { Schema } from "./types";
import SchemaItem from "./SchemaItem";
import { SchemaFormContextKey } from "./context";

export default defineComponent({
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
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    // good practice to add future extensions
    const handleChange = (v: any) => {
      props.onChange(v);
    };
    // if needs responsive render, context needs to be wrapped with reactive({SchemaItem})
    const context = { SchemaItem };
    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value } = props;
      return <SchemaItem schema={schema} rootSchema={schema} value={value} onChange={handleChange} />;
    };
  },
});
