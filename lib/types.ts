import { PropType, defineComponent, DefineComponent } from "vue";

/* define Schema and SchemaTypes */
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

/* define Theme */
const BaseWidgetProps = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const;

const SelectionWidget = {
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

type BaseWidgetPropsType = DefineComponent<typeof BaseWidgetProps>;

type SelectionWidgetType = DefineComponent<typeof SelectionWidget>;

export interface Theme {
  widgets: {
    SelectionWidget: SelectionWidgetType;
    TextWidget: BaseWidgetPropsType;
    NumberWidget: BaseWidgetPropsType;
  };
}
