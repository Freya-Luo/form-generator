import { inject } from "vue";
import { SchemaFieldType } from "./types";

export const SchemaFormContextKey = Symbol();

export function useSFContext() {
  const context: { SchemaItem: SchemaFieldType } | undefined = inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaItem should be provided.");
  }
  return context;
}
