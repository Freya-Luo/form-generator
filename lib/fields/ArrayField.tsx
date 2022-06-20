import { defineComponent } from "vue";
import { FieldProps, Schema } from "../types";
import { useSFContext } from "../context";
import ArrayItem from "./ArrayItem";

/**
 * 1) Single Type Array
 * {
 *   items: { type: string },
 * }
 *
 * 2) Multiple Type Array
 * {
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 * }
 * 3) Fixed option Array
 * {
 *   items: { type: string, enum: ['1', '2'] },
 * }
 */
export default defineComponent({
  name: "ArrayField",
  props: FieldProps,
  setup(props) {
    const context = useSFContext();

    const handleArrayItemChange = (val: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = val;
      // two-way binding change the field
      props.onChange(arr);
    };

    const handleAdd = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      // undefined: custom can self-define later
      arr.splice(index + 1, 0, undefined);
      props.onChange(arr);
    };

    const handleDelete = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      // delete one item
      arr.splice(index, 1);
      props.onChange(arr);
    };

    const handleMoveUp = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      // extract the current item and put it one step up
      const item = arr.splice(index, 1);
      arr.splice(index - 1, 0, item[0]);
      props.onChange(arr);
    };

    const handleMoveDown = (index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      // extract the current item and put it one step down
      const item = arr.splice(index, 1);
      arr.splice(index + 1, 0, item[0]);
      props.onChange(arr);
    };

    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaItem = context.SchemaItem;

      const isMultiTypeArray = Array.isArray(schema.items);
      const isFixedOptionArray = schema.items && (schema.items as any).enum;

      if (isMultiTypeArray) {
        // multiple type array
        const items: Schema[] = schema.items as any;
        const array = Array.isArray(value) ? value : [];

        return items.map((schema: Schema, index: number) => (
          <SchemaItem
            schema={schema}
            key={index}
            rootSchema={rootSchema}
            value={array[index]}
            onChange={(val: any) => handleArrayItemChange(val, index)}
          />
        ));
      } else if (isFixedOptionArray) {
      } else {
        // single type array
        const arr = Array.isArray(value) ? value : [];

        return arr.map((v: any, index: number) => {
          return (
            <ArrayItem
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onMoveDown={handleMoveDown}
              onMoveUp={handleMoveUp}
            >
              <SchemaItem
                schema={schema.items as Schema}
                value={v}
                key={index}
                rootSchema={rootSchema}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              />
            </ArrayItem>
          );
        });
      }

      return <div>hh</div>;
    };
  },
});
