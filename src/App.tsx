/* eslint no-use-before-define: 0 */

import { defineComponent, ref, Ref, reactive, watchEffect } from "vue";
import { createUseStyles } from "vue-jss";

import MonacoEditor from "./components/MonacoEditor";

const useStyles = createUseStyles({
  editor: {
    minHeight: 400,
    width: 400,
  },
});

const schema = {
  type: "string",
};

function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}

export default defineComponent({
  setup() {
    const schemaRef: Ref<any> = ref(schema);

    const handleOnChange = (code: string) => {
      let schema: any;
      try {
        schema = JSON.parse(code);
      } catch (err) {}

      schemaRef.value = schema;
    };

    const classesRef = useStyles();

    return () => {
      const classes = classesRef.value;
      const code = toJson(schemaRef.value);

      return (
        <div>
          <MonacoEditor class={classes.editor} code={code} onChange={handleOnChange} title="Editor" />
        </div>
      );
    };
  },
});
