import { PropType, defineComponent, DefineComponent } from "vue";
import { ErrorSchema } from "./validator";
import { FormatDefinition, KeywordDefinition, CompilationContext } from "ajv";

/* Define Schema and SchemaTypes */
export enum SchemaTypes {
  "NUMBER" = "number",
  "INTEGER" = "integer",
  "STRING" = "string",
  "OBJECT" = "object",
  "ARRAY" = "array",
  "BOOLEAN" = "boolean",
}

type SchemaRef = { $ref: string };

export interface Schema {
  type?: SchemaTypes | string;
  title?: string;
  const?: any;
  format?: string;
  default?: any;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | Schema[] | SchemaRef;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  required?: string[];
  enum?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItems?: Schema;
}

export const FieldProps = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
  rootSchema: {
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
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
} as const; // declare the props as read-only type

export const SchemaItemComponent = defineComponent({
  props: FieldProps,
});

export type SchemaFieldType = typeof SchemaItemComponent;

/* Define Theme related types */
// Base Widget Component
export const BaseWidgetProps = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {},
  // use onChange to change props.value
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  customOptions: {
    type: Object as PropType<{ [key: string]: any }>,
  },
} as const;

export type BaseWidgetType = DefineComponent<typeof BaseWidgetProps, {}, {}>;

export const BaseWidget: BaseWidgetType = defineComponent({
  props: BaseWidgetProps,
  setup() {
    return () => null;
  },
}) as BaseWidgetType;

// Selection Widget Component
export const SelectionWidgetProps = {
  ...BaseWidgetProps,
  options: {
    type: Array as PropType<
      {
        key: string;
        value: any;
      }[]
    >,
    required: true,
  },
} as const;

export type SelectionWidgetType = DefineComponent<typeof SelectionWidgetProps>;

export enum SelectionWidgetName {
  SelectionWidget = "SelectionWidget",
}

export enum BaseWidgetName {
  TextWidget = "TextWidget",
  NumberWidget = "NumberWidget",
}

export interface Theme {
  widgets: {
    [SelectionWidgetName.SelectionWidget]: SelectionWidgetType;
    [BaseWidgetName.TextWidget]: BaseWidgetType;
    [BaseWidgetName.NumberWidget]: BaseWidgetType;
  };
}

/* UI Schema */
export type UISchema = {
  widget?: string | BaseWidgetType;
  properties?: {
    [key: string]: UISchema;
  };
  items?: UISchema | UISchema[];
} & {
  // enable any properties defined in this schema (e.g., color)
  [key: string]: any;
};

export interface CustomAjvFormat {
  name: string;
  definition: FormatDefinition;
  component: BaseWidgetType;
}

// Source code from Ajv package
interface CustomAjvKeywordDefinition {
  type?: string | Array<string>;
  async?: boolean;
  $data?: boolean;
  errors?: boolean | string;
  metaSchema?: object;
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean;
  statements?: boolean;
  dependencies?: Array<string>;
  modifying?: boolean;
  valid?: boolean;
  // one and only one of the following properties should be present
  macro: (schema: any, parentSchema: object, it: CompilationContext) => object | boolean;
}

export interface CustomAjvKeyword {
  name: string;
  definition: CustomAjvKeywordDefinition;
  transformSchema: (originSchema: Schema) => Schema;
}
