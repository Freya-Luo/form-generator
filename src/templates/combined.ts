export default {
  name: "Combined",
  schema: {
    description: "A collection of form examples.",
    type: "object",
    required: ["First Name", "Last Name"],
    properties: {
      firstName: {
        title: "First Name",
        type: "string",
        default: "Freya",
      },
      lastName: {
        title: "Last Name",
        type: "string",
      },
      motto: {
        title: "Bio",
        type: "string",
        minLength: 10,
      },
      singleTypeArray: {
        title: "singleTypeArray",
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
      multiSelectArray: {
        title: "multiSelectArray",
        type: "array",
        items: {
          type: "string",
          enum: ["123", "456", "789"],
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
    firstName: "Freya",
    lastName: "Luo",
    age: 24,
    motto: "Work hard and enjoy life",
    singleTypeArray: [
      { name: "freya", age: 24 },
      { name: "eight", age: 17 },
    ],
  },
};
