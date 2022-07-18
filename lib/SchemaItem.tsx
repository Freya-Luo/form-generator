import { computed, defineComponent } from "vue";
import { SchemaTypes, FieldProps } from "./types";
import StringField from "./fields/StringField";
import NumberField from "./fields/NumberField";
import ObjectField from "./fields/ObjectField";
import ArrayField from "./fields/ArrayField";
import { retrieveSchema } from "./utils";
import { useSFContext } from "./context";

// Intermediate item - passes the props down to the specific component
export default defineComponent({
  name: "SchemaItem",
  props: FieldProps,
  setup(props) {
    const formContext = useSFContext();
    // avoid re-rendering compute-consuming functions unless
    // properties in any of the following three objects change
    const rretrievedSchmeaRef = computed(() => {
      const { schema, rootSchema, value } = props;
      return formContext.transformSchemaRef.value(retrieveSchema(schema, rootSchema, value));
    });

    return () => {
      let Component: any;
      const { schema } = props;

      const retrievedSchmea = rretrievedSchmeaRef.value;
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
        case SchemaTypes.OBJECT: {
          Component = ObjectField;
          break;
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField;
          break;
        }
        default: {
          console.warn(`${type} is not supported`);
        }
      }

      return <Component {...props} schema={retrievedSchmea} />;
    };
  },
});
