<template>
  <q-td key="_id" :props="cell">
    <q-btn
      v-if="cell.row.hasXML"
      flat
      size="md"
      icon="launch"
      :to="{ name: 'receiveddtes/:id', params: { id: cell.row[field] } }"
      target="_blank"
    />
    <div class="text-grey" v-else>
      SIN XML
      <q-tooltip
        >No ha llegado el XML a la casilla de correo
        intercambio@dte.haulmer.com</q-tooltip
      >
    </div>
  </q-td>
</template>

<script setup>
const props = defineProps(['cell', 'field'])
</script>
