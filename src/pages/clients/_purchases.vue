<script setup>
import { provide } from 'vue'
import { useRoute } from 'vue-router'
import { useEmittedDtes } from 'stores/emitteddtes'
import formatter from 'tools/formatter'

const route = useRoute()

const emittedDtes = useEmittedDtes()
provide(emittedDtes.$id, emittedDtes)
</script>

<template>
  <PageResponsive :maxWidth="650">
    <div class="q-pa-lg">
      <div class="row items-center q-mb-lg">
        <ButtonBack />

        <div class="text-h5">Historial de Compras</div>
      </div>

      <ListLazy
        :storeId="emittedDtes.$id"
        :query="{
          equal: { client: route.params.id }
        }"
        :sort="{ createdAt: -1 }"
        :rowsPerPage="10"
        noItems="Aún no tienes compras"
        v-slot="{ docs }"
      >
        <q-item
          v-for="emittedDte of docs"
          :key="emittedDte._id"
          class="q-py-md"
          clickable
          :to="{
            name: 'clientPurchase',
            params: { purchaseId: emittedDte._id }
          }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              icon="shopping_cart"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label caption>BOLETA: {{ emittedDte.number }}</q-item-label>
            <q-item-label>{{
              formatter.datetime(emittedDte.createdAt)
            }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>TOTAL</q-item-label>
            <q-item-label>{{
              formatter.currency(emittedDte.totalAmount)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </ListLazy>
    </div>
  </PageResponsive>
</template>
