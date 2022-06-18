import { defineComponent } from "vue";
import { FieldProps, Schema } from "../types";
import { useSFContext } from "../context";

/**
 * {
 *   items: { type: string },
 * }
 *
 * {  multiple-type array
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum: ['1', '2'] },
 * }
 */
export default defineComponent({
  name: "ArrayField",
  props: FieldProps,
  setup(props) {
    const context = useSFContext();

    const handleMultiTypeChange = (val: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = val;
      // two-way binding change
      props.onChange(arr);
    };

    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaItem = context.SchemaItem;

      const isMultiTypeArray = Array.isArray(schema.items);
      if (isMultiTypeArray) {
        const items: Schema[] = schema.items as any;
        const array = Array.isArray(value) ? value : [];

        return items.map((schema: Schema, index: number) => (
          <SchemaItem
            schema={schema}
            key={index}
            rootSchema={rootSchema}
            value={array[index]}
            onChange={(val: any) => handleMultiTypeChange(val, index)}
          />
        ));
      }
      return <div>hh</div>;
    };
  },
});
