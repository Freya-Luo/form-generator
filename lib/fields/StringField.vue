<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup>
// import { defineProps } from "vue"; no need to import, compiler macro
import { FieldProps, Schema } from "../types";

const props = defineProps(FieldProps);

function handleChange(e: any) {
  props.onChange(e.target.value);
}
</script>
