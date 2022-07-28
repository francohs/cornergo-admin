<script setup>
import { onMounted, inject, ref } from 'vue'
import { useProviders } from 'stores/providers'

const props = defineProps({
  modelValue: [String, Array],
  storeId: String,
  field: String,
  id: String
})

const storeId = props.storeId ? inject(props.storeId) : null
const providers = useProviders()
const options = ref([])
const model = ref(props.modelValue)

onMounted(async () => {
  await fetchOptions()
})

async function fetchOptions() {
  if (!providers.options.length) {
    await providers.getQueryOptions({
      query: {},
      select: ['alias'],
      sort: {
        alias: 1
      }
    })
  }
  options.value = providers.options
}

async function filterFn(value, updateOptions) {
  if (options.value.length === 0) {
    await fetchOptions()
  }
  updateOptions()
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
    label="Proveedor"
    option-label="alias"
    option-value="alias"
    :model-value="model"
    @update:model-value="update"
    emit-value
    map-options
    @filter="filterFn"
    :options="options"
    :loading="providers.loading || providers.saving"
  />
</template>
