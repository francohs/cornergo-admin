<script setup>
import formatter from 'tools/formatter'

const props = defineProps({
  label: String,
  value: String | Number,
  bold: Boolean,
  fontSize: String | Number,
  format: String
})
</script>

<template>
  <div
    class="row justify-between q-pb-sm"
    :class="{ 'text-bold': bold }"
    :style="`font-size: ${fontSize}px`"
  >
    <div>{{ label }}</div>
    <div>{{ format ? formatter[format](value) : value }}</div>
  </div>
</template>
