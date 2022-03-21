<template>
  <LayoutPage :loading="orders.loading" class="q-pa-md">
    <q-list
      bordered
      separator
      class="rounded-borders"
      style="border-color: grey"
    >
      <q-item
        v-for="product of orders.doc.order"
        :key="product._id"
        style="border-color: grey"
      >
        <ItemOrder :product="product" />
      </q-item>
    </q-list>
  </LayoutPage>
</template>

<script setup>
import { onMounted, provide, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useOrders } from 'stores/orders'
import { useProducts } from 'stores/products'
import { useSupplies } from 'stores/supplies'

const route = useRoute()

const orders = useOrders()
provide(orders.$id, orders)
const products = useProducts()
provide(products.$id, products)
const supplies = useSupplies()
provide(supplies.$id, supplies)

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
