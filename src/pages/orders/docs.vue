<template>
  <LayoutPage :loading="orders.loading">
    <div class="row full-height q-col-gutter-x-md">
      <div v-for="day of Object.keys(orders.docs)" :key="day" class="col">
        <q-card class="full-height">
          <div class="text-h6 q-pa-md">
            {{ day.charAt(0).toUpperCase() + day.slice(1) }}
          </div>
          <q-separator />
          <ListDragOrders :day="day" />
          <q-separator />
        </q-card>
      </div>
    </div>
  </LayoutPage>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrders } from 'stores/orders'
import { provide } from 'vue'

const orders = useOrders()
provide(orders.$id, orders)

onMounted(async () => {
  await orders.getDocs()
})
</script>
