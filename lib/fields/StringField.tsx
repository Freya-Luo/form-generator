import { defineComponent } from "vue";
import { FieldProps, BaseWidgetName } from "../types";
import { getWidget } from "../themeProvider";

export default defineComponent({
  name: "StringFeild",
  props: FieldProps,
  setup(props) {
    const TextWidgetRef = getWidget(BaseWidgetName.TextWidget);

    return () => {
      const { rootSchema, errorSchema, ...otherProps } = props;
      const TextWidget = TextWidgetRef.value;

      return <TextWidget {...otherProps} errors={errorSchema.__errors} />;
    };
  },
});
