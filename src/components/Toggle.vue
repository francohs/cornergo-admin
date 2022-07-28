<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  storeId: String,
  id: String,
  field: String,
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const store = props.storeId ? inject(props.storeId) : null

async function update(value) {
  if (props.id) {
    await store.update(props.id, { [props.field]: value })
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <q-toggle
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="update"
    color="green"
    class="q-ma-none text-grey-8"
    size="sm"
  />
</template>
