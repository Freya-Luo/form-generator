import { computed, defineComponent, inject, PropType, provide, ComputedRef, ref } from "vue";
import { BaseWidgetName, SelectionWidgetName, Theme, UISchema, BaseWidgetType } from "./types";
import { isObject } from "./utils";

const ThemeContextKey = Symbol();

const ThemeProvider = defineComponent({
  name: "ThemeProvider",
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  // SchemaForm component as the default slot of ThemeProvider
  setup(props, { slots }) {
    // Get the ref of the theme object, so later theme changes can notify the subscribed components
    const context = computed(() => props.theme);
    provide(ThemeContextKey, context);

    return () => slots.default && slots.default();
  },
});

/**
 * Get the ref of the widget. T extends enum types.
 *
 * @note Using ref insead of the true statci value is because:
 * At the time the code is compiled, the values (props) of the widget are determined,
 * later changes cannot be reflected. However, we want theme passed down from props can
 * be responsive to the future changes.
 *
 * @param name name of the widget
 * @returns Ref of the widget
 */
export function getWidget<T extends BaseWidgetName | SelectionWidgetName>(name: T, uiSchema?: UISchema) {
  // If custom schema is present, use it instead of the default one
  if (uiSchema?.widget && isObject(uiSchema.widget)) {
    return ref(uiSchema.widget as BaseWidgetType);
  }

  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(ThemeContextKey);
  if (!context) {
    throw new Error("SchemaItem should be provided.");
  }
  // get the ref
  const widgetRef = computed(() => {
    return context.value.widgets[name];
  });

  return widgetRef;
}

export default ThemeProvider;
