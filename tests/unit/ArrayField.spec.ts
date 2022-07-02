import { mount } from "@vue/test-utils";
import SchemaFrom, { NumberField, StringField, SelectionField, ArrayField } from "../../lib";

describe("ArrayField", () => {
  it("Render multiple type array", () => {
    const wrapper = mount(SchemaFrom as any, {
      props: {
        schema: {
          type: "array",
          items: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        value: [],
        onChange: () => {},
      },
    });

    const arrayField = wrapper.findComponent(ArrayField);
    const strField = arrayField.findComponent(StringField);
    const numField = arrayField.findComponent(NumberField);

    expect(strField.exists()).toBeTruthy();
    expect(numField.exists()).toBeTruthy();
  });

  it("Render single type array", () => {
    const wrapper = mount(SchemaFrom as any, {
      props: {
        schema: {
          type: "array",
          items: {
            type: "string",
          },
        },
        value: ["1", "2"],
        onChange: () => {},
      },
    });

    const arrayField = wrapper.findComponent(ArrayField);
    const strFields = arrayField.findAllComponents(StringField);

    expect(strFields.length).toBe(2);
    expect(strFields[0].props("value")).toBe("1");
    expect(strFields[1].props("value")).toBe("2");
  });

  it("Render single type array with fixed selection options", () => {
    const wrapper = mount(SchemaFrom as any, {
      props: {
        schema: {
          type: "array",
          items: {
            type: "string",
            enum: ["1", "2", "3"],
          },
        },
        value: [],
        onChange: () => {}, // elsint-disable-line
      },
    });

    const arrayField = wrapper.findComponent(ArrayField);
    const selectField = arrayField.findComponent(SelectionField);

    expect(selectField.exists()).toBeTruthy();
  });
});
