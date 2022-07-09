import { PropType, defineComponent, DefineComponent } from "vue";

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
} as const; // declare the props as read-only type

export const SchemaItemComponent = defineComponent({
  props: FieldProps,
});

export type SchemaFieldType = typeof SchemaItemComponent;

/* Define Theme related types */
// Base Widget Component
export const BaseWidgetProps = {
  value: {},
  // use onChange to change props.value
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const;

export type BaseWidgetPropsType = DefineComponent<typeof BaseWidgetProps, {}, {}>;

export const BaseWidget: BaseWidgetPropsType = defineComponent({
  props: BaseWidgetProps,
  setup() {
    return () => null;
  },
}) as BaseWidgetPropsType;

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

export type SelectionWidgetPropsType = DefineComponent<typeof SelectionWidgetProps>;

export enum SelectionWidgetName {
  SelectionWidget = "SelectionWidget",
}

export enum BaseWidgetName {
  TextWidget = "TextWidget",
  NumberWidget = "NumberWidget",
}

export interface Theme {
  widgets: {
    [SelectionWidgetName.SelectionWidget]: SelectionWidgetPropsType;
    [BaseWidgetName.TextWidget]: BaseWidgetPropsType;
    [BaseWidgetName.NumberWidget]: BaseWidgetPropsType;
  };
}
