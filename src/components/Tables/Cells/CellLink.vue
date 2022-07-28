<script setup>
import { openURL } from 'quasar'

const props = defineProps({
  cell: Object,
  field: String,
  url: String,
  name: String,
  noLink: String,
  blank: Boolean
})
</script>

<template>
  <q-td :key="field" :props="cell">
    <q-btn v-if="url" flat size="md" icon="launch" @click="openURL(url)" />
    <q-btn
      v-else-if="name"
      flat
      size="md"
      icon="launch"
      :to="{ name: `${name}/:id`, params: { id: cell.row[field] } }"
      :target="blank ? '_blank' : ''"
    />
    <span v-else class="text-grey-8">{{ noLink }}</span>
  </q-td>
</template>
