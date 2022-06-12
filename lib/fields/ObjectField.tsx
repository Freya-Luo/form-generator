import { defineComponent, inject, DefineComponent, ExtractPropTypes, ComponentPublicInstance } from "vue";
import { FieldProps } from "../types";
import { SchemaFormContextKey } from "../context";
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

const SchemaItemComponent = defineComponent({
  props: FieldProps,
});

type SchemaItemType = typeof SchemaItemComponent;

export default defineComponent({
  name: "ObjectField",
  props: FieldProps,
  setup(props) {
    // use provide & inject => avoid circular reference dependencies
    // get the context provided by the ancestor node
    const context: { SchemaItem: SchemaItemType } | undefined = inject(SchemaFormContextKey);
    if (!context) {
      throw Error("SchemaItem should be extracted.");
    }

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
      const { schema, rootSchema, value } = props;
      const { SchemaItem } = context;

      const properties = schema.properties || {};
      const currentValue: any = isObject(value) ? value : {};

      return Object.keys(properties).map((key: string, index: number) => (
        <SchemaItem
          schema={properties[key]}
          rootSchema={rootSchema}
          value={currentValue[key]}
          key={index}
          onChange={(val: any) => handleObjectFieldChange(key, val)}
        />
      ));
    };
  },
});
