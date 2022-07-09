import { defineComponent } from "vue";
import { BaseWidgetProps, BaseWidgetPropsType } from "../types";

const NumberWidget: BaseWidgetPropsType = defineComponent({
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
}) as BaseWidgetPropsType;

export default NumberWidget;
