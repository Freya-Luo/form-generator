import { defineComponent, computed } from "vue";
import { FieldProps, BaseWidgetName } from "../types";
import { getWidget } from "../themeProvider";

export default defineComponent({
  name: "StringFeild",
  props: FieldProps,
  setup(props) {
    // const TextWidgetRef = getWidget(BaseWidgetName.TextWidget);

    /* Extension example 1: Apply customized password widget */
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(BaseWidgetName.TextWidget, props);
      return widgetRef.value;
    });

    /* Extension example 2: Apply custom color prop */
    const widgetCustomOptionsRef = computed(() => {
      const { widget, properties, items, ...restOptions } = props.uiSchema;
      return restOptions;
    });

    return () => {
      const { rootSchema, errorSchema, ...otherProps } = props;
      const TextWidget = TextWidgetRef.value;

      return <TextWidget {...otherProps} errors={errorSchema.__errors} customOptions={widgetCustomOptionsRef.value} />;
    };
  },
});
