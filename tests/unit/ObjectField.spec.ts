import { mount } from "@vue/test-utils";

import JsonSchemaForm, { NumberField, StringField } from "../../lib";

describe("ObjectFiled", () => {
  let schema: any;
  beforeEach(() => {
    schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
      },
    };
  });

  it("Render properties corresponding to the correct field types", async () => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value: {},
        onChange: () => {},
      },
    });

    const strField = wrapper.findComponent(StringField);
    const numField = wrapper.findComponent(NumberField);

    expect(strField.exists()).toBeTruthy();
    expect(numField.exists()).toBeTruthy();
  });

  it("Change value when children components trigger onChange", async () => {
    let value: any = {};
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const strField = wrapper.findComponent(StringField);
    const numField = wrapper.findComponent(NumberField);
    // compared to the unit tests for StringField and NumberField
    // here, only test high-level ObjectField behaviors
    // cause we do not need to care about the innermost implementation of these components
    await strField.props("onChange")("1");
    expect(value.name).toEqual("1");
    await numField.props("onChange")(1);
    expect(value.age).toEqual(1);
  });

  it("Render properties corresponding to the correct field types", async () => {
    let value: any = {
      name: "test",
    };
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema,
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const strField = wrapper.findComponent(StringField);
    await strField.props("onChange")(undefined);

    expect(value.name).toBeUndefined();
  });
});
