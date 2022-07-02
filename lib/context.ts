import { inject } from "vue";
import { SchemaFieldType, Theme } from "./types";
export const SchemaFormContextKey = Symbol();

export function useSFContext() {
  const context: { SchemaItem: SchemaFieldType; theme: Theme } | undefined = inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaItem should be extracted.");
  }
  return context;
}
