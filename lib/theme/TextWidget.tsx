import { defineComponent, computed } from "vue";
import { BaseWidgetProps, BaseWidgetType } from "../types";

import { wrapWithFormItem } from "./FormItem";

const TextWidget: BaseWidgetType = wrapWithFormItem(
  defineComponent({
    name: "TextWidget",
    props: BaseWidgetProps,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);
      };

      /** Extension example 2: Apply custom color prop */
      const styleRef = computed(() => {
        return {
          color: (props.customOptions && props.customOptions.color) || "black",
        };
      });

      return () => {
        return <input type="text" value={props.value as any} onInput={handleChange} style={styleRef.value} />;
      };
    },
  }) as BaseWidgetType
);

export default TextWidget;
