import { defineComponent, PropType } from "vue";
import { createUseStyles } from "vue-jss";

const useStyles = createUseStyles({
  container: {
    border: "1px solid #eee",
  },
  actions: {
    background: "#eee",
    padding: 10,
    textAlign: "right",
  },
  action: {
    "& + &": {
      // only apply marginLeft to items that have a following item
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
});

export default defineComponent({
  name: "ArrayItem",
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onMoveUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onMoveDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles();

    const handleAdd = () => props.onAdd(props.index);
    const handleMoveDown = () => props.onMoveDown(props.index);
    const handleMoveUp = () => props.onMoveUp(props.index);
    const handleDelete = () => props.onDelete(props.index);

    return () => {
      const classes = classesRef.value;
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              Add
            </button>
            <button class={classes.action} onClick={handleDelete}>
              Delete
            </button>
            <button class={classes.action} onClick={handleMoveUp}>
              Move Up
            </button>
            <button class={classes.action} onClick={handleMoveDown}>
              Move Down
            </button>
          </div>

          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      );
    };
  },
});
