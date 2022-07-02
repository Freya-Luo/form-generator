import { mount, shallowMount } from "@vue/test-utils";
import { defineComponent, h } from "vue";

import SchemaFrom, { NumberField } from "../../lib";

// Props passing down to the real component is actually an async operation
describe("JsonSchemaFrom", () => {
  it("should render correct number field", async () => {
    let value = "";
    const wrapper = mount(SchemaFrom as any, {
      props: {
        schema: {
          type: "number",
        },
        value: value,
        onChange: (v: any) => {
          value = v;
        },
      },
    });

    const numberField = wrapper.findComponent(NumberField);
    expect(numberField.exists()).toBeTruthy();
    // not use "await numberField.props('onChange')('123')"
    // consider the inner implementation which is an <input> element
    // use this element to trigger the input event
    const input = numberField.find("input");
    input.element.value = "123";
    input.trigger("input");
    expect(value).toBe(123);
  });
});

/**
 * shallowMount: children components' render function won't be executed, though the Virtual object
 * of children components are built. (that is why it has a slight better performance)
 */
