import { inject, Ref } from "vue";
import { BaseWidgetType, SchemaFieldType } from "./types";

export const SchemaFormContextKey = Symbol();

export function useSFContext() {
  const context:
    | { SchemaItem: SchemaFieldType; mappedAjvFormatRef: Ref<{ [key: string]: BaseWidgetType }> }
    | undefined = inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaItem should be provided.");
  }
  return context;
}
