import { defineComponent } from "vue";

import { SchemaTypes, FieldProps } from "./types";
import StringField from "./fields/StringField.vue";
import NumberField from "./fields/NumberField";

// Intermediate item - passes the props down to the specific component
export default defineComponent({
  name: "SchemaItem",
  props: FieldProps,
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
