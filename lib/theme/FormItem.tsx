import { defineComponent } from "vue";
import { BaseWidgetProps, BaseWidgetType, SelectionWidgetType } from "../types";

import { createUseStyles } from "vue-jss";

const useStyles = createUseStyles({
  container: {},
  label: {
    display: "block",
    color: "#777",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    margin: "5px 0",
    padding: 0,
    paddingLeft: 20,
  },
});

const FormItem = defineComponent({
  name: "FormItem",
  props: BaseWidgetProps,
  setup(props, { slots }) {
    const classesRef = useStyles();

    return () => {
      const { schema, errors } = props;
      const classes = classesRef.value;
      return (
        <div class={classes.container}>
          <label class={classes.label}>{schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errorText}>
            {errors?.map((err) => (
              <li>{err}</li>
            ))}
          </ul>
        </div>
      );
    };
  },
});

export default FormItem;

/**
 * HOC component. Wrap a vue component with another vue component.
 *
 * Decouple the business logic of the wrapper component, which aims to add/enhance the functionalities
 * of the inner one, and the inner component.
 * @param Widget
 * @returns
 */
export function wrapWithFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: BaseWidgetProps,
    setup(props, { attrs, slots }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs} />
          </FormItem>
        );
      };
    },
  }) as any;
}
