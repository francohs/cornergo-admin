<script setup>
import { inject } from 'vue'

const props = defineProps(['storeId', 'field', 'cell', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const store = inject(props.storeId)

async function update(value) {
  await store.update(props.cell.row._id, { [props.field]: value })
  emit('update:modelValue', value)
}
</script>

<template>
  <q-td :key="field" :props="cell">
    <q-toggle
      :modelValue="modelValue"
      @update:modelValue="update"
      color="green"
    />
  </q-td>
</template>
