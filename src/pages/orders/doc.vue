<template>
  <h2>Order</h2>
</template>

<script setup>
import { useOrders } from 'stores/orders'
import { onMounted, provide, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const orders = useOrders()
const id = route.params.id
const order = reactive({})

provide(orders.$id, orders)

onMounted(async () => {
  try {
    await orders.getDoc(id)
    Object.assign(order, orders.doc)
  } catch (error) {
    console.error(error)
  }
})
</script>
