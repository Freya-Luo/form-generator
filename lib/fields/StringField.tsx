import { defineComponent, computed } from "vue";
import { FieldProps, BaseWidgetName } from "../types";
import { getWidget } from "../themeProvider";

export default defineComponent({
  name: "StringFeild",
  props: FieldProps,
  setup(props) {
    // const TextWidgetRef = getWidget(BaseWidgetName.TextWidget);

    /** Extension example 1: Apply customized password widget */
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(BaseWidgetName.TextWidget, props.uiSchema);
      return widgetRef.value;
    });

    return () => {
      const { rootSchema, errorSchema, ...otherProps } = props;
      const TextWidget = TextWidgetRef.value;

      return <TextWidget {...otherProps} errors={errorSchema.__errors} />;
    };
  },
});
