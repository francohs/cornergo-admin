<script setup>
import { inject } from 'vue'

const props = defineProps(['storeId', 'field', 'cell'])

const store = inject(props.storeId)

const onToggle = async value => {
  await store.update(props.cell.row._id, { [props.field]: value })
}
</script>

<template>
  <q-td :key="field" :props="cell">
    <q-toggle
      :modelValue="cell.row[field]"
      @update:modelValue="onToggle"
      color="green"
    />
  </q-td>
</template>
