export default {
  name: "Demo",
  schema: {
    type: "object",
    properties: {
      pass1: {
        type: "string",
        minLength: 5,
        title: "Password",
      },
      pass2: {
        type: "string",
        minLength: 5,
        title: "Comfirm Password",
      },
    },
  },
  async customValidator(data: any, errors: any) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError("Passwords are not same.");
        }
        resolve();
      }, 2000);
    });
  },
  uiSchema: {},
  default: 1,
};
