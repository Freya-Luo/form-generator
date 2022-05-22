import { defineComponent } from "vue";

import { FieldProps } from "../types";

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
    return () => {
      return <div>Object Field</div>;
    };
  },
});
