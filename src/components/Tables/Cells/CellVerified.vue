<script setup>
import { ref, inject } from 'vue'

const props = defineProps(['storeId', 'field', 'cell', 'modelValue'])

const store = inject(props.storeId)
const loading = ref(false)

async function toggle() {
  loading.value = true
  await store.update(props.cell.row._id, {
    [props.field]: !props.cell.row[props.field]
  })
  loading.value = false
}
</script>

<template>
  <q-td :key="field" :props="cell">
    <q-btn
      flat
      rounded
      size="md"
      icon="check_circle"
      :color="props.cell.row[field] ? 'positive' : 'grey'"
      @click="toggle"
      :loading="loading"
    />
  </q-td>
</template>
