import Ajv from "ajv";
import { Schema } from "./types";
import jsonpointer from "jsonpointer";
import union from "lodash.union";
import mergeAllOf from "json-schema-merge-allof";

export function isObject(thing: any) {
  return typeof thing === "object" && thing !== null && !Array.isArray(thing);
}

export const ADDITIONAL_PROPERTY_FLAG = "__additional_property";

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

// Retrieve schema based on the subschemas if necessary and other additional properties
export function retrieveSchema(schema: any, rootSchema = {}, formData: any = {}): Schema {
  if (!isObject(schema)) {
    return {} as Schema;
  }
  let resolvedSchema = resolveSchema(schema, rootSchema, formData);

  if ("allOf" in schema) {
    try {
      resolvedSchema = mergeAllOf({
        ...resolvedSchema,
        allOf: resolvedSchema.allOf,
      } as any) as Schema;
    } catch (e) {
      console.warn("Cannot merge subschemas in allOf:\n" + e);
      const { allOf, ...resolvedSchemaWithoutAllOf } = resolvedSchema;
      return resolvedSchemaWithoutAllOf;
    }
  }
  const hasAdditionalProperties =
    resolvedSchema.hasOwnProperty("additionalProperties") && resolvedSchema.additionalProperties !== false;
  if (hasAdditionalProperties) {
    // stub existing additional properties into schema
    return stubExistingAdditionalProperties(resolvedSchema, rootSchema, formData);
  }
  return resolvedSchema;
}

// Create a new entry for each key in the formData in schema "properties" field
export function stubExistingAdditionalProperties(schema: Schema, rootSchema: Schema = {}, formData: any = {}) {
  schema = {
    ...schema,
    properties: { ...schema.properties },
  };

  Object.keys(formData).forEach((key) => {
    if ((schema as any).properties.hasOwnProperty(key)) {
      // no need to stub, schema already has the property
      return;
    }

    let additionalProperties;
    if (schema.additionalProperties.hasOwnProperty("$ref")) {
      additionalProperties = retrieveSchema({ $ref: schema.additionalProperties["$ref"] }, rootSchema, formData);
    } else if (schema.additionalProperties.hasOwnProperty("type")) {
      additionalProperties = { ...schema.additionalProperties };
    } else {
      additionalProperties = { type: formData[key] };
    }

    (schema as any).properties[key] = additionalProperties;
    // set additional property flag
    (schema as any).properties[key][ADDITIONAL_PROPERTY_FLAG] = true;
  });

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
