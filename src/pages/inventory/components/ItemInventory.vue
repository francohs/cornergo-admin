<script setup>
import { ref, inject, computed } from 'vue'
import QuantityInventory from './QuantityInventory.vue'
import moment from 'moment'

const products = inject('products')
const inventory = inject('inventory')

const props = defineProps(['product', 'search'])

const QuantityRef = ref(null)
const loading = ref(false)

const checkColor = computed(() => {
  if (!props.product.lastStockUpdate) return 'grey'
  const lastStockUpdate = moment(props.product.lastStockUpdate)
  const diff = lastStockUpdate.diff(moment.now(), 'days')
  return diff < -7 || props.product.stock < 0 ? 'grey' : 'positive'
})

async function confirm() {
  loading.value = true
  await products.update(
    props.product._id,
    {
      stock: QuantityRef.value.quantity
    },
    null
  )
  inventory.update(props.product._id, products.doc)
  loading.value = false
}
</script>

<template>
  <div class="q-ma-sm">
    <div class="q-mb-sm">
      {{ product.name }}
    </div>
    <div class="row items-center justify-between">
      <div class="row items-center">
        <q-btn
          flat
          icon="check_circle"
          :color="checkColor"
          rounded
          @click="confirm"
          :loading="loading"
        />
        <div>
          <div>{{ product.code }}</div>
          <div
            v-if="search.length >= 3 && product.providers.length"
            class="text-caption"
          >
            {{ product.providers[0] }}
          </div>
        </div>
      </div>
      <div style="width: 140px">
        <QuantityInventory v-model="product.stock" ref="QuantityRef" />
      </div>
    </div>
  </div>
  <q-separator />
</template>
