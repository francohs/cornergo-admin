<template>
  <q-td key="_id" :props="cell">
    <q-btn
      v-if="cell.row.xmlUrl"
      flat
      size="md"
      icon="launch"
      :to="{ name: 'receiveddtes/:id', params: { id: cell.row[field] } }"
      target="_blank"
    />
    <q-btn
      v-else
      dense
      class="text-grey-8"
      style="font-size: 12px"
      label="sin xml"
      @click="syncBsaleDte"
      :loading="loading"
    >
      <q-tooltip>Reintentar obtener XML</q-tooltip>
    </q-btn>
  </q-td>
</template>

<script setup>
import { ref } from 'vue'
import { useReceivedDtes } from 'stores/receiveddtes'

const props = defineProps(['cell', 'field'])

const loading = ref(false)
const receivedDtes = useReceivedDtes()

const syncBsaleDte = async () => {
  loading.value = true
  await receivedDtes.syncBsaleDte(props.cell.row.bsaleId)
  loading.value = false
}
</script>
