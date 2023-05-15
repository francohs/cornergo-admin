<script setup>
import { computed, onMounted, provide, reactive } from 'vue'
import { useProviders } from 'stores/providers'
import ItemProvider from './components/ItemProvider.vue'
import { io } from 'boot/socket'

const providers = useProviders()
provide(providers.$id, providers)

const orderDays = computed(() => {
  const days = {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: []
  }

  for (let provider of providers.docs) {
    for (let day of provider.orderDays) {
      days[day].push(provider)
    }
  }

  return days
})

onMounted(async () => {
  await providers.getQueryDocs({
    query: {
      equal: { active: true }
    },
    select: ['alias', 'orderDays', 'lastOrder', 'checkStock', 'noReceivedDtes'],
    sort: { alias: 1 }
  })

  io.on('providerUpdate', provider => {
    const index = providers.docs.findIndex(p => p._id == provider._id)
    if (index > -1) {
      providers.docs[index] = provider
    }
  })
})
</script>
<template>
  <LayoutPage :loading="providers.loading">
    <div class="row full-height q-col-gutter-x-md">
      <div v-for="day of Object.keys(orderDays)" :key="day" class="col">
        <q-card class="full-height">
          <div class="text-h6 q-pa-md">
            {{ day.toUpperCase() }}
          </div>
          <q-separator />

          <q-list
            separator
            v-for="provider of orderDays[day]"
            :key="provider._id"
            ><ItemProvider :provider="provider" :day="day"
          /></q-list>
        </q-card>
      </div>
    </div>
  </LayoutPage>
</template>
