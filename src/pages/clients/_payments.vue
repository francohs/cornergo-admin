<script setup>
import { provide } from 'vue'
import { useRoute } from 'vue-router'
import { useClients } from 'stores/clients'
import { usePayments } from 'stores/payments'
import formatter from 'tools/formatter'

const route = useRoute()

const clients = useClients()
const payments = usePayments()
provide(payments.$id, payments)

const payIcons = {
  Efectivo: 'payments',
  'Tarjeta de Debito': 'credit_card',
  'Tarjeta de Credito': 'credit_card',
  Transferencia: 'local_atm',
  Cheque: 'local_atm'
}
</script>

<template>
  <PageResponsive :maxWidth="650">
    <div class="q-pa-lg">
      <q-linear-progress
        indeterminate
        class="absolute-top"
        v-if="payments.loading"
      />

      <div class="row items-center q-mb-lg">
        <ButtonBack />

        <div class="text-h5">Historial de Abonos: {{ clients.doc.name }}</div>
      </div>

      <ListLazy
        :storeId="payments.$id"
        :query="{
          equal: { client: route.params.id }
        }"
        :sort="{ createdAt: -1 }"
        :rowsPerPage="10"
        noItems="Aún no tienes abonos"
        v-slot="{ docs }"
      >
        <q-item v-for="payment of docs" :key="payment._id" class="q-py-md">
          <q-item-section avatar>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              :icon="payIcons[payment.payType]"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label caption>{{ payment.payType }}</q-item-label>
            <q-item-label>{{
              formatter.datetime(payment.createdAt)
            }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>Monto</q-item-label>
            <q-item-label>{{
              formatter.currency(payment.amount)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </ListLazy>
    </div>
  </PageResponsive>
</template>
