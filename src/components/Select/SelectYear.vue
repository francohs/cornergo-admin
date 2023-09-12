<script setup>
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
  <q-select v-bind="$attrs" :options="options" outlined style="width: 200px" />
</template>
