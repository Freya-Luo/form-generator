import { defineComponent } from "vue";
import { BaseWidgetProps, BaseWidgetPropsType } from "../types";

const TextWidget: BaseWidgetPropsType = defineComponent({
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
}) as BaseWidgetPropsType;

export default TextWidget;
