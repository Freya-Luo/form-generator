import { defineComponent, PropType } from "vue";

import { Schema, SchemaTypes } from "./types";
import StringField from "./fields/StringField";
import NumberField from "./fields/NumberField";

// Intermediate item - passes the props down to the specific component
export default defineComponent({
  name: "SchemaItem",
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
    return () => {
      let Component: any;
      const { schema } = props;
      const type = schema.type;

      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField;
          break;
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField;
          break;
        }
        default: {
          console.warn(`${type} is not supported`);
        }
      }

      return <Component {...props} />;
    };
  },
});
