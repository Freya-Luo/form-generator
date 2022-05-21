<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { FieldProps, Schema } from "../types";

const props = defineProps(FieldProps);

function handleChange(e: any) {
  console.log(e);
  props.onChange(e.target.value);
}
</script>
