<script setup>
import { ref, inject, computed } from 'vue'
import moment from 'moment'

const props = defineProps(['product'])

const products = inject('products')
const inventory = inject('inventory')

const loading = ref(false)

const checkColor = computed(() => {
  if (!props.product.lastStockUpdate) return 'grey'
  const lastStockUpdate = moment(props.product.lastStockUpdate)
  const diff = lastStockUpdate.diff(moment.now(), 'days')
  return diff < -7 ? 'grey' : 'positive'
})

const stockChanged = async id => {
  inventory.update(id, products.doc)
}

const stockChecked = async id => {
  loading.value = true
  await products.update(id, { lastStockUpdate: new Date() })
  stockChanged(id)
  loading.value = false
}

defineExpose({ stockChanged })
</script>

<template>
  <q-btn
    flat
    size="md"
    icon="check_circle"
    :color="checkColor"
    @click="stockChecked(product._id)"
    :loading="loading"
  />
</template>
