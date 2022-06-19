export default {
  name: "Singlet",
  schema: {
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        default: "Chuck",
      },
      lastName: {
        type: "string",
      },
      telephone: {
        type: "string",
        minLength: 10,
      },
      arrays: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "number",
            },
          },
        },
      },
      optionArrays: {
        type: "array",
        items: {
          type: "string",
          enum: ["hhh", "kkk", "ooo"],
        },
      },
    },
  },
  uiSchema: {
    title: "A registration form",
    properties: {
      firstName: {
        title: "First name",
      },
      lastName: {
        title: "Last name",
      },
      telephone: {
        title: "Telephone",
      },
    },
  },
  default: {
    firstName: "Chuck",
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
    arrays: [{ name: "freya", age: 24 }],
  },
};
