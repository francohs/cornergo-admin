<script setup>
const options = [
  { label: 'ENERO', value: '01' },
  { label: 'FEBRERO', value: '02' },
  { label: 'MARZO', value: '03' },
  { label: 'ABRIL', value: '04' },
  { label: 'MAYO', value: '05' },
  { label: 'JUNIO', value: '06' },
  { label: 'JULIO', value: '07' },
  { label: 'AGOSTO', value: '08' },
  { label: 'SEPTIEMBRE', value: '09' },
  { label: 'OCTUBRE', value: '10' },
  { label: 'NOVIEMBRE', value: '11' },
  { label: 'DICIEMBRE', value: '12' }
]
</script>

<template>
  <q-select
    v-bind="$attrs"
    :options="options"
    map-options
    emit-value
    outlined
    style="width: 200px"
  />
</template>
