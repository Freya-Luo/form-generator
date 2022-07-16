import { defineComponent } from "vue";
import { FieldProps } from "../types";
import { useSFContext } from "../context";
import { isObject } from "../utils";

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
  setup(props) {
    // use provide & inject => avoid circular reference dependencies
    // get the context provided by the ancestor node
    const context = useSFContext();

    const handleObjectFieldChange = (key: string, newVal: any) => {
      const value: any = isObject(props.value) ? props.value : {};
      // if newVal is not an object, init it as an object
      if (newVal === undefined) {
        delete value[key];
      } else {
        value[key] = newVal;
      }
      props.onChange(value);
    };

    return () => {
      const { schema, uiSchema, rootSchema, value, errorSchema } = props;
      const SchemaItem = context.SchemaItem;

      const properties = schema.properties || {};
      const currentValue: any = isObject(value) ? value : {};

      return Object.keys(properties).map((key: string, index: number) => (
        <SchemaItem
          schema={properties[key]}
          uiSchema={uiSchema.properties ? uiSchema.properties[key] || {} : {}}
          rootSchema={rootSchema}
          value={currentValue[key]}
          key={index}
          onChange={(val: any) => handleObjectFieldChange(key, val)}
          errorSchema={errorSchema[key] || {}}
        />
      ));
    };
  },
});
