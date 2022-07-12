import Ajv from "ajv";
import toPath from "lodash.topath";
import { Schema } from "./types";
import { isObject } from "./utils";

interface ValidationError {
  name: string;
  property: string;
  message: string | undefined;
  params: Ajv.ErrorParameters;
  schemaPath: string;
}

/**
 * Use Ajv to validate the form fields
 *
 * @param validator Ajv valiator object
 * @param formData Input values of the form data
 * @param schema Schema that restricts the range of form values
 * @returns Translated errorSchema object
 */
export async function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  customValidator?: (data: any, errors: any) => void
) {
  let schemaError: any = null;
  try {
    // error in Schema will throw errors
    validator.validate(schema, formData);
  } catch (err) {
    schemaError = err;
  }

  /*  transform Ajv errors from array into object */
  if (validator.errors === null || validator.errors === undefined) {
    validator.errors = [];
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

  // step 4: apply any custom validation logic
  // if no custom validator, directly return the transformed error object
  if (!customValidator) {
    console.log("goes out here1111");
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    };
  }
  console.log("goes out here22222");
  // else, create an error proxy to kick off the process of custom validation
  // , and merge all the errors
  const proxy = createErrorProxy();
  await customValidator(formData, proxy);
  const newErrorSchema = mergeErrors(errorSchema, proxy, true);
  const newErrors = toErrorList(newErrorSchema);

  return {
    errors: newErrors,
    errorSchema: newErrorSchema,
    valid: newErrors.length === 0,
  };
}

export type ErrorSchema = {
  [level: string]: ErrorSchema;
} & {
  __errors?: string[];
};

/**
 * Helper function. It transfers errors[] to the error schema object (like JSON format).
 */
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

/**
 * Helper function. It creates a proxy which adds errors to the "__errors[]".
 */
function createErrorProxy() {
  const rawError = {};
  return new Proxy(rawError, {
    get(target, key, receiver) {
      if (key === "addError") {
        return (errMsg: string) => {
          const __errors = Reflect.get(target, "__errors", receiver);
          // if "__errors" array has already existed
          if (__errors && Array.isArray(__errors)) {
            __errors.push(errMsg);
          } else {
            (target as any).__errors = [errMsg];
          }
        };
      }
      // create a new error proxy for the next level error (rawError.obj.a)
      // check if there is already a proxy on the next level
      const nextLevelProxy = Reflect.get(target, key, receiver);
      if (nextLevelProxy === undefined) {
        // !! NOT directly use res[key] = createErrorProxy(), which will go through "get" proxy handler again (loops)
        const proxy: any = createErrorProxy();
        (target as any)[key] = proxy;
        return proxy;
      }

      return nextLevelProxy;
    },
  });
}

export function mergeErrors(obj1: any, obj2: any, concatArrays = false) {
  // recursively merge deeply nested objects
  const acc = Object.assign({}, obj1); // prevent mutation of the source object
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeErrors(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}

export function toErrorList(errorSchema: ErrorSchema, fieldName = "root") {
  let errors: ValidationError[] = [];
  if ("__errors" in errorSchema) {
    errors = errors.concat(
      (errorSchema.__errors || []).map((stack) => {
        return {
          message: `${fieldName}: ${stack}`,
        } as ValidationError;
      })
    );
  }
  return Object.keys(errorSchema).reduce((acc, key) => {
    if (key !== "__errors") {
      acc = acc.concat(toErrorList(errorSchema[key], key));
    }
    return acc;
  }, errors);
}
