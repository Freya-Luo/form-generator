import { defineComponent, PropType, provide, Ref, shallowRef, watch, watchEffect } from "vue";
import { Schema } from "./types";
import SchemaItem from "./SchemaItem";
import { SchemaFormContextKey } from "./context";
import Ajv, { Options } from "ajv";
import { validateFormData, ErrorSchema } from "./validator";

// Ajv necessary configurations setup
const defaultAjvOptions: Options = {
  allErrors: true,
  jsonPointers: true,
};

interface ContextRef {
  validate: () => {
    errors: any[];
    valid: boolean;
  };
}

type validateResultType = ReturnType<ContextRef["validate"]> & {
  errorSchema: ErrorSchema;
};

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
  },
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    // good practice to add future extensions
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    // if needs responsive render, context needs to be wrapped with reactive({SchemaItem})
    const context = { SchemaItem };
    provide(SchemaFormContextKey, context);

    // ajvOptions is a reactive prop, so using shalloWRef and watchEffect
    // any changes in props.ajvOptions, it will create a new Ajv instance
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as Ref<Ajv.Ajv>;
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });
    });

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            validate() {
              const result = validateFormData(validatorRef.value, props.value, props.schema) as validateResultType;
              // use shallowRef to allow the SchemaForm component to get this "result" value
              errorSchemaRef.value = result.errorSchema;
              return result;
            },
          };
        }
      },
      {
        immediate: true,
      }
    );

    return () => {
      const { schema, value } = props;
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          errorSchema={errorSchemaRef.value || {}}
        />
      );
    };
  },
});
