import { defineComponent, ref, Ref, reactive, watchEffect } from "vue";
import { createUseStyles } from "vue-jss";
import MonacoEditor from "./components/MonacoEditor";
import templates from "./templates";
import SchemaForm, { ThemeProvider } from "../lib";
import theme from "../lib/theme";

type Schema = any;
type UISchema = any;

function toJson(data: any) {
  return JSON.stringify(data, null, 2);
}

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "1200px",
    margin: "0 auto",
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: "flex",
    justifyContent: "space-between",
    "& > *": {
      width: "46%",
    },
  },
  content: {
    display: "flex",
  },
  form: {
    padding: "0 20px",
    flexGrow: 1,
  },
  menuButton: {
    appearance: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "inline-block",
    padding: 15,
    borderRadius: 5,
    "&:hover": {
      background: "#efefef",
    },
  },
  menuSelected: {
    background: "#337ab7",
    color: "#fff",
    "&:hover": {
      background: "#337ab7",
    },
  },
});

export default defineComponent({
  setup() {
    const selectedRef: Ref<number> = ref(0);
    const classesRef = useStyles();

    const template: {
      schema: Schema | null;
      data: any;
      uiSchema: UISchema | null;
      schemaCode: string;
      dataCode: string;
      uiSchemaCode: string;
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: "",
      dataCode: "",
      uiSchemaCode: "",
    });

    watchEffect(() => {
      const index = selectedRef.value;
      const d = templates[index];
      template.schema = d.schema;
      template.data = d.default;
      template.uiSchema = d.uiSchema;
      template.schemaCode = toJson(d.schema);
      template.dataCode = toJson(d.default);
      template.uiSchemaCode = toJson(d.uiSchema);
    });

    const handleChange = (val: any) => {
      template.data = val;
      template.dataCode = toJson(val);
    };

    function handleCodeChange(field: "schema" | "data" | "uiSchema", value: string) {
      try {
        const json = JSON.parse(value);
        template[field] = json;
        (template as any)[`${field}Code`] = value;
      } catch (err) {}
    }

    const handleSchemaChange = (val: string) => handleCodeChange("schema", val);
    const handleDataChange = (val: string) => handleCodeChange("data", val);
    const handleUISchemaChange = (val: string) => handleCodeChange("uiSchema", val);

    return () => {
      const classes = classesRef.value;
      const selected = selectedRef.value;

      return (
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>JsonSchema Form</h1>
            <div>
              {templates.map((template, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={template.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={template.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={template.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
            </div>
            <div class={classes.form}>
              <ThemeProvider theme={theme as any}>
                <SchemaForm schema={template.schema} value={template.data} onChange={handleChange} />
              </ThemeProvider>
            </div>
          </div>
        </div>
      );
    };
  },
});
