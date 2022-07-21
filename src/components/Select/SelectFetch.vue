<script setup>
import { onMounted, inject, ref } from 'vue'

const props = defineProps({
  modelValue: [String, Object, Array],
  storeId: String,
  field: String,
  id: String,
  optionStore: String,
  optionLabel: String,
  optionValue: String,
  lazy: Boolean,
  descending: Boolean
})

const storeId = inject(props.storeId)
const optionStore = inject(props.optionStore)
const options = ref([])
const model = ref(props.modelValue)

onMounted(async () => {
  if (!props.lazy) {
    await fetchOptions()
  }
})

async function fetchOptions() {
  await optionStore.getQueryDocs({
    query: {},
    select: props.optionValue
      ? [props.optionValue, props.optionLabel]
      : [props.optionLabel],
    sort: {
      [props.optionLabel]: props.descending ? -1 : 1
    }
  })
  options.value = optionStore.docs
}

async function filterFn(value, update) {
  if (options.value.length === 0) {
    if (props.lazy) await fetchOptions()
  }
  update()
}

async function update(value) {
  if (props.id) {
    await storeId.update(props.id, { [props.field]: value })
  }
  model.value = value
}
</script>

<template>
  <Select
    v-bind="$attrs"
    :option-label="optionLabel"
    :option-value="optionValue"
    :model-value="model"
    @update:model-value="update"
    emit-value
    map-options
    @filter="filterFn"
    :options="options"
    :loading="optionStore.loading"
  />
</template>
