<script setup>
import { onMounted, provide } from 'vue'
import { useOrders } from 'stores/orders'
import ItemProvider from './components/ItemProvider.vue'

const orders = useOrders()
provide(orders.$id, orders)

onMounted(async () => {
  await orders.getDocs()
})
</script>
<template>
  <LayoutPage :loading="orders.loading">
    <div class="row full-height q-col-gutter-x-md">
      <div v-for="day of Object.keys(orders.docs)" :key="day" class="col">
        <q-card class="full-height">
          <div class="text-h6 q-pa-md">
            {{ day.toUpperCase() }}
          </div>
          <q-separator />

          <q-list
            separator
            v-for="provider of orders.docs[day]"
            :key="provider._id"
            ><ItemProvider :provider="provider" :day="day"
          /></q-list>
        </q-card>
      </div>
    </div>
  </LayoutPage>
</template>
