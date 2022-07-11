import { defineComponent } from "vue";
import { BaseWidgetProps, BaseWidgetType } from "../types";

import { wrapWithFormItem } from "./FormItem";

const NumberWidget: BaseWidgetType = wrapWithFormItem(
  defineComponent({
    name: "NumberWidget",
    props: BaseWidgetProps,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);
      };
      return () => {
        return <input type="number" value={props.value as any} onInput={handleChange} />;
      };
    },
  }) as BaseWidgetType
);

export default NumberWidget;
