import PasswordWidget from "../widgets/PasswordWidget";

export default {
  name: "Demo",
  schema: {
    type: "object",
    properties: {
      password1: {
        type: "string",
        minLength: 6,
        title: "Password",
      },
      password2: {
        type: "string",
        minLength: 6,
        title: "Comfirm Password",
      },
      color: {
        type: "string",
        format: "color",
        title: "Color",
      },
      text: {
        type: "string",
        test: true,
        title: "Keyword Text",
      },
    },
  },
  async customValidator(data: any, errors: any) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (data.password1 !== data.password2) {
          errors.password2.addError("Invalid! Passwords are not equal.");
        }
        resolve();
      }, 1000);
    });
  },
  uiSchema: {
    properties: {
      password1: {
        widget: PasswordWidget,
      },
      password2: {
        color: "green",
      },
    },
  },
};
