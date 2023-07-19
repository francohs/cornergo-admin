<script setup>
import { LocalStorage } from 'quasar'
import { onMounted, provide, ref, computed } from 'vue'
import { useClients } from 'stores/clients'
import formatter from 'tools/formatter'

const clients = useClients()
provide(clients.$id, clients)

const actives = ref(LocalStorage.getItem('clientsActives') || false)

onMounted(async () => await clients.getDocs())

const filteredClients = computed(() =>
  actives.value ? clients.docs.filter(c => c.active) : clients.docs
)

function saveActives() {
  LocalStorage.set('clientsActives', actives.value)
}
</script>

<template>
  <PageResponsive :loading="clients.loading" :maxWidth="650">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="row">
          <div class="text-h5">Clientes</div>
          <q-toggle
            v-model="actives"
            @update:modelValue="saveActives"
            color="green"
            label="Solo Activos"
            class="q-ml-md"
          />
        </div>

        <ButtonLinkCreate :storeId="clients.$id" />
      </div>

      <q-list v-if="filteredClients.length > 0" bordered separator>
        <q-item
          clickable
          v-for="client of filteredClients"
          :key="client._id"
          class="q-py-md"
          :to="{ name: 'clients/:id', params: { id: client._id } }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              :color="client.active ? 'primary' : 'grey'"
              text-color="white"
              icon="person"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ client.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>Saldo</q-item-label>
            <q-item-label>{{
              formatter.currency(client.balance)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div
        v-if="clients.docs.length == 0"
        class="q-mt-xl text-center text-grey-7"
      >
        Aún no tienes clients
      </div>
    </div>
  </PageResponsive>
</template>
