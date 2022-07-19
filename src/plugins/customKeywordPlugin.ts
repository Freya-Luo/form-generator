import { CustomAjvKeyword } from "../../lib/types";

/* Extension example 4: Apply custom Ajv keyword plugin */
const keyword: CustomAjvKeyword = {
  name: "test",
  definition: {
    macro: () => {
      return {
        minLength: 10,
      };
    },
  },
  transformSchema(schema) {
    return {
      ...schema,
      minLength: 10,
    };
  },
};

export default keyword;
