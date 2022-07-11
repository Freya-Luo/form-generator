import { FieldProps, BaseWidgetName } from "../types";
import { defineComponent } from "vue";
import { getWidget } from "../themeProvider";

export default defineComponent({
  name: "NumberFeild",
  props: FieldProps,
  setup(props) {
    const handleChange = (value: string) => {
      const num = Number(value);

      if (Number.isNaN(num)) {
        props.onChange(undefined);
      } else {
        props.onChange(num);
      }
    };

    const NumberWidgetRef = getWidget(BaseWidgetName.NumberWidget);

    return () => {
      const { rootSchema, errorSchema, ...otherProps } = props;
      const NumberWidget = NumberWidgetRef.value;

      return <NumberWidget {...otherProps} onChange={handleChange} errors={errorSchema.__errors} />;
    };
  },
});
