import { BaseWidgetProps, BaseWidgetType } from "../../lib/types";
import { defineComponent } from "vue";

import { wrapWithFormItem } from "../../lib/theme/FormItem";

const PasswordWidget: BaseWidgetType = wrapWithFormItem(
  defineComponent({
    name: "PasswordWidget",
    props: BaseWidgetProps,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value;
        e.target.value = props.value;
        props.onChange(value);
      };
      return () => {
        return <input type="password" value={props.value as any} onInput={handleChange} />;
      };
    },
  })
);

export default PasswordWidget;
