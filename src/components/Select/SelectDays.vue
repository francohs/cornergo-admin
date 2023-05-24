<template>
  <q-select
    v-bind="$attrs"
    :options="options"
    multiple
    use-chips
    outlined
    class="col"
  />
</template>

<script setup>
const options = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo'
]
</script>
