import Ajv from "ajv";
import { Schema } from "./types";
import jsonpointer from "jsonpointer";
import union from "lodash.union";
import mergeAllOf from "json-schema-merge-allof";

export function isObject(thing: any) {
  return typeof thing === "object" && thing !== null && !Array.isArray(thing);
}

export function hasOwnProperty(obj: any, key: string) {
  // directly using obj.hasOwnProperty not correct, obj may have already overwritten
  // hasOwnProperty() method
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const defaultInstance = new Ajv();
export function validateData(schema: any, data: any) {
  const valid = defaultInstance.validate(schema, data);
  return {
    valid,
    errors: defaultInstance.errors,
  };
}

export function resolveSchema(schema: Schema, rootSchema = {}, formData = {}) {
  // $ref: path relative to the rootSchema, reference to the actual schema component
  if (hasOwnProperty(schema, "$ref")) {
    return resolveReference(schema, rootSchema, formData);
  } // dependencies: render different components based on the runtime customer selection
  else if (hasOwnProperty(schema, "dependencies")) {
    const resolvedSchema = resolveDependencies(schema, rootSchema, formData);
    return retrieveSchema(resolvedSchema, rootSchema, formData);
  } // jsonSchema "allOf" keyword handler
  else if (hasOwnProperty(schema, "allOf") && Array.isArray(schema.allOf)) {
    return {
      ...schema,
      allOf: schema.allOf.map((allOfSubschema) => retrieveSchema(allOfSubschema, rootSchema, formData)),
    };
  } else {
    // no corresponding handlers are found, return the original schema
    return schema;
  }
}

export function retrieveSchema(schema: Schema, rootSchema = {}, formData: any = {}): Schema {
  // TODO: retrieve schema based on the subschemas if necessary and other additional properties
  return schema;
}

function resolveDependencies(schema: Schema, rootSchema: any, formData: any): Schema {
  // TODO: resolve dependencies based on the existing properties
  return schema;
}

function resolveReference(schema: Schema, rootSchema: any, formData: any): Schema {
  // TODO: resolve referred schema against the schema's base URI
  return schema;
}
