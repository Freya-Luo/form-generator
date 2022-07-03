import { defineComponent, PropType, ref, watch } from "vue";
import { SelectionWidgetProps, SelectionWidgetType } from "../types";

const Selection: SelectionWidgetType = defineComponent({
  name: "SelectionField",
  props: SelectionWidgetProps,
  setup(props) {
    // may not use v-model to change "props" which is supposed to be one-way binding
    // so, instead using ref() and manually updating the values
    const currentValRef = ref(props.value);

    // listen to the change of currentValRef, and then assign to the props.value
    watch(currentValRef, (newVal, oldVal) => {
      if (newVal !== props.value) {
        props.onChange(newVal);
      }
    });

    // listen to the change of props.value, and then assign to the currrentValRef.value
    watch(
      () => props.value, // 2nd way of usage
      (newVal) => {
        if (newVal !== currentValRef.value) {
          currentValRef.value = newVal;
        }
      }
    );

    return () => {
      const { options } = props;
      return (
        <select multiple={true} v-model={currentValRef.value}>
          {options.map((option) => (
            <option value={option.value}>{option.key}</option>
          ))}
        </select>
      );
    };
  },
}) as SelectionWidgetType;

export default Selection;
