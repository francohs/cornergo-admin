<script setup>
const props = defineProps(['cell'])
</script>

<template>
  <q-td key="providers" :props="cell">
    <q-chip v-for="provider of cell.row.providers">{{ provider }}</q-chip>
  </q-td>
</template>
