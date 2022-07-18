import { defineComponent, PropType, provide, Ref, shallowRef, ref, watch, watchEffect, computed } from "vue";
import { BaseWidgetType, CustomAjvFormat, CustomAjvKeyword, Schema, UISchema } from "./types";
import SchemaItem from "./SchemaItem";
import { SchemaFormContextKey } from "./context";
import Ajv, { Options } from "ajv";
import { validateFormData, ErrorSchema } from "./validator";

// Ajv necessary configurations setup
const defaultAjvOptions: Options = {
  allErrors: true,
};

interface ContextRef {
  validate: () => Promise<{
    errors: any[];
    valid: boolean;
  }>;
}

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
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
      // ajv validator
      type: Object as PropType<Options>,
    },
    customValidator: {
      // custome validator
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    customAjvFormats: {
      type: [Array, Object] as PropType<CustomAjvFormat[] | CustomAjvFormat>,
    },
    customAjvKeywords: {
      type: [Array, Object] as PropType<CustomAjvKeyword[] | CustomAjvKeyword>,
    },
  },
  name: "SchemaForm",
  setup(props, { slots }) {
    // good practice to add future extensions
    const handleChange = (v: any) => {
      props.onChange(v);
    };

    // ajvOptions is a reactive prop, so using shalloWRef and watchEffect
    // any changes in props.ajvOptions, it will create a new Ajv instance
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as Ref<Ajv.Ajv>;
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });

      /* Extension 3: Apply Ajv custom formats prop */
      if (props.customAjvFormats) {
        const customFormats = Array.isArray(props.customAjvFormats) ? props.customAjvFormats : [props.customAjvFormats];

        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition);
        });
      }

      /* Extension 4: Apply Ajv custom keyword prop */
      if (props.customAjvKeywords) {
        const customFormats = Array.isArray(props.customAjvKeywords)
          ? props.customAjvKeywords
          : [props.customAjvKeywords];

        customFormats.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition);
        });
      }
    });

    // transform to error schema
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});

    /* Control the async validation result (kind of like throttling control) */
    const resolvedValidationRef = ref();
    const resolvedIndex = ref(0); // records the context when calling doValidate

    async function doValidate() {
      const index = (resolvedIndex.value += 1);
      const result = await validateFormData(validatorRef.value, props.value, props.schema, props.customValidator);

      // This is because the returned result of the current validation is not the
      // most up to date one, we do not need this anymore
      // (some other validation processes are triggered during this async procedure)
      if (index !== resolvedIndex.value) return;

      // use shallowRef to allow the SchemaForm component to get this "result" value
      errorSchemaRef.value = result.errorSchema;

      resolvedValidationRef.value(result); // call resolve
      resolvedValidationRef.value = undefined; // clean it up
    }

    watch(
      () => props.value, // every time when form values change, redo validation and discard the old validation procedures
      () => {
        if (resolvedValidationRef.value) {
          doValidate();
        }
      },
      { deep: true }
    );

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            validate() {
              return new Promise((resolve) => {
                resolvedValidationRef.value = resolve;
                doValidate();
              });
            },
          };
        }
      },
      {
        immediate: true,
      }
    );

    /* -----------  Extension 3: Apply Ajv custom formats prop ------------- */
    const mappedAjvFormatRef = computed(() => {
      if (props.customAjvFormats) {
        const customFormats = Array.isArray(props.customAjvFormats) ? props.customAjvFormats : [props.customAjvFormats];

        return customFormats.reduce((result, format) => {
          result[format.name] = format.component;
          return result;
        }, {} as { [key: string]: BaseWidgetType });
      }
      return {};
    });

    /* -----------  Extension 4: Apply Ajv custom keyword prop ------------- */
    const transformSchemaRef = computed(() => {
      if (props.customAjvKeywords) {
        const customKeywords = Array.isArray(props.customAjvKeywords)
          ? props.customAjvKeywords
          : [props.customAjvKeywords];

        return (schema: Schema) => {
          let newSchema = schema;
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema);
            }
          });
          return newSchema;
        };
      }
      return (s: Schema) => s;
    });

    // if needs responsive render, context needs to be wrapped with reactive({SchemaItem})
    const context = { SchemaItem, mappedAjvFormatRef, transformSchemaRef };
    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value, uiSchema } = props;
      return (
        <SchemaItem
          schema={schema}
          uiSchema={uiSchema || {}}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          errorSchema={errorSchemaRef.value || {}}
        />
      );
    };
  },
});
