<script setup>
import { ref, inject, computed } from 'vue'
import formatter from 'tools/formatter'

const props = defineProps(['cell'])

const products = inject('products')

const loading = ref(false)
const checkColor = ref('grey')

const labelChecked = async cell => {
  loading.value = true
  await products.update(cell.row._id, { price: cell.row.price })
  loading.value = false
  checkColor.value = 'positive'
}
</script>

<template>
  <q-td key="labeled" :props="cell">
    <q-btn
      flat
      size="md"
      icon="check_circle"
      :color="checkColor"
      @click="labelChecked(cell)"
      :loading="loading"
    >
      <q-tooltip> Crear etiqueta precio </q-tooltip>
    </q-btn>
  </q-td>
</template>
