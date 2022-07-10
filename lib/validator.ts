import Ajv from "ajv";
import toPath from "lodash.topath";
import { Schema } from "./types";

interface ValidationError {
  name: string;
  property: string;
  message: string | undefined;
  params: Ajv.ErrorParameters;
  schemaPath: string;
}

export function validateFormData(validator: Ajv.Ajv, formData: any, schema: Schema) {
  let schemaError: any = null;
  try {
    // error in Schema will throw errors
    validator.validate(schema, formData);
  } catch (err) {
    schemaError = err;
  }

  /*  transform Ajv errors from array into object */
  if (validator.errors === null || validator.errors === undefined) {
    return [];
  }
  // step 1: extra all erros from Ajv
  let errors = validator.errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath,
    };
  });

  // step 2: combine errors from form data validation and schema errors
  if (schemaError) {
    errors = [
      ...errors,
      {
        message: schemaError.message,
      } as ValidationError,
    ];
  }

  // step 3: transform to object, define an Error schema holding all error[i]s
  const errorSchema = transformToErrorSchema(errors);

  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  };
}

export type ErrorSchema = {
  [level: string]: ErrorSchema;
} & {
  __errors: string[];
};

function transformToErrorSchema(errors: ValidationError[]) {
  if (errors.length < 1) return {};

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property); // .obj.a -> [obj, a] (format conversion)

    // If the property is at root, toPath will return res[0] as "", just remove it
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    // [a, b, c] =? {a:{b: {c: {}}}}
    let parent = errorSchema;
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {};
      }
      parent = parent[segment];
    }

    if (Array.isArray(parent.__errors)) {
      // __errors to avoid name collision with a possible sub schema field named
      parent.__errors = parent.__errors.concat(message || "");
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }
    return errorSchema;
  }, {} as ErrorSchema);
}
