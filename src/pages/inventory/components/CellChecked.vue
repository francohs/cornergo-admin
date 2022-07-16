<template>
  <q-td key="checked" :props="cell">
    <q-btn
      flat
      size="md"
      icon="check_circle"
      :color="checkColor"
      @click="stockChecked(cell.row._id)"
      :loading="loading"
    >
      <q-tooltip v-if="cell.row.lastStockUpdate">
        {{ formatter.datetime(cell.row.lastStockUpdate) }}
      </q-tooltip>
    </q-btn>
  </q-td>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import formatter from 'tools/formatter'
import moment from 'moment'

const props = defineProps(['cell'])

const products = inject('products')
const inventory = inject('inventory')

const loading = ref(false)

const checkColor = computed(() => {
  if (!props.cell.row.lastStockUpdate) return 'grey'
  const lastStockUpdate = moment(props.cell.row.lastStockUpdate)
  const diff = lastStockUpdate.diff(moment.now(), 'days')
  console.log(diff)
  return diff < -3 ? 'grey' : 'positive'
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
