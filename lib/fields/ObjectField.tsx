import { defineComponent, inject } from "vue";
import { FieldProps } from "../types";
import { SchemaFormContextKey } from "../context";

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "number",
    },
  },
};

export default defineComponent({
  name: "ObjectField",
  props: FieldProps,
  setup() {
    // use provide & inject => avoid circular reference dependencies
    const context: any = inject(SchemaFormContextKey); // get the context provided by the ancestor node

    return () => {
      const { SchemaItem } = context;
      console.log(SchemaItem);
      return <div>Object Field</div>;
    };
  },
});
