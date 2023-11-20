<script setup>
const props = defineProps({
  width: [String, Number]
})

const options = [
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
  '2028'
]
</script>

<template>
  <q-select
    v-bind="$attrs"
    :options="options"
    outlined
    :style="`width: ${width ? width : 200}px;`"
  />
</template>
