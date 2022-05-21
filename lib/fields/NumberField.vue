<template>
  <input type="number" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup>
// import { defineProps } from "vue";
import { FieldProps, Schema } from "../types";

const props = defineProps(FieldProps);

function handleChange(e: any) {
  const num = Number(e.target.value);

  if (Number.isNaN(num)) {
    props.onChange(undefined);
  } else {
    props.onChange(num);
  }
}
</script>
