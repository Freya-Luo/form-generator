import { defineComponent, computed } from "vue";
import { CustomAjvFormat, BaseWidgetProps } from "../../lib/types";

import { wrapWithFormItem } from "../../lib/theme/FormItem";

/* Extension example 3: Apply custom Ajv format plugin */
const format: CustomAjvFormat = {
  name: "color",
  definition: {
    type: "string",
    validate: /^#[0-9A-Fa-f]{6}$/, // hex color number
  },
  component: wrapWithFormItem(
    defineComponent({
      name: "ColorWidget",
      props: BaseWidgetProps,
      setup(props) {
        const handleChange = (e: any) => {
          const value = e.target.value;
          e.target.value = props.value;
          props.onChange(value);
        };

        const styleRef = computed(() => {
          return {
            color: (props.customOptions && props.customOptions.color) || "black",
          };
        });

        return () => {
          return <input type="color" value={props.value as any} onInput={handleChange} style={styleRef.value} />;
        };
      },
    })
  ),
};

export default format;
