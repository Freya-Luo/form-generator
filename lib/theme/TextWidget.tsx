import { defineComponent } from "vue";
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
      return () => {
        return <input type="text" value={props.value as any} onInput={handleChange} />;
      };
    },
  }) as BaseWidgetType
);

export default TextWidget;
