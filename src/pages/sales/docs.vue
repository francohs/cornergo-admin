<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useEmittedDtes } from 'stores/emitteddtes'
import ChartSales from './components/ChartSales.vue'
import formatter from 'tools/formatter'

const emittedDtes = useEmittedDtes()

const chart = ref(null)
const date = ref(formatter.date(new Date()))
const totals = reactive({})

onMounted(async () => {
  await onDate()
})

async function onDate() {
  await emittedDtes.getSalesByDate(date.value)
  Object.assign(totals, emittedDtes.sales.totals)
  chart.value.update(emittedDtes.sales.docs)
}
</script>

<template>
  <LayoutPage>
    <div class="row items-start">
      <div style="width: 338px" class="q-mr-sm">
        <q-card class="row column q-px-lg q-pt-sm">
          <div>
            <div
              class="row items-center justify-between text-grey-8 q-mt-md q-mb-lg full-width"
            >
              <div class="row items-center">
                <q-icon name="file_copy" size="sm" class="q-mr-sm" />
                <div class="text-h6 q-mr-md">Ventas</div>
              </div>

              <q-btn
                dense
                flat
                rounded
                icon="refresh"
                color="primary"
                @click="onDate"
                :loading="emittedDtes.loading"
              />
            </div>

            <q-separator />
          </div>

          <Calendar v-model="date" @update:modelValue="onDate" />
        </q-card>
        <q-card class="q-mt-sm" style="height: 301.89px">
          <q-card-section>
            <div v-if="totals.totalSales">
              <ItemTotal
                :label="`TOTAL (${totals.totalSales.count})`"
                :value="totals.totalSales.amount"
                format="currency"
                bold
                fontSize="20"
              />
              <q-separator class="q-mb-md" />
              <ItemTotal
                :label="`Efectivo (${totals.cash.count})`"
                :value="totals.cash.amount"
                format="currency"
              />
              <ItemTotal
                :label="`Tarjeta Débito (${totals.debit.count})`"
                :value="totals.debit.amount"
                format="currency"
              />
              <ItemTotal
                :label="`Tarjeta Crédito (${totals.credit.count})`"
                :value="totals.credit.amount"
                format="currency"
              />
              <ItemTotal
                :label="`Transferencia (${totals.transfer.count})`"
                :value="totals.transfer.amount"
                format="currency"
              />
              <ItemTotal
                :label="`Crédito Cliente (${totals.clientCredit.count})`"
                :value="totals.clientCredit.amount"
                format="currency"
              />
              <q-separator class="q-mb-md" />
              <ItemTotal
                label="MARGEN"
                :value="totals.totalMargin"
                format="currency"
                bold
                fontSize="20"
              />
            </div>
          </q-card-section>
          <q-inner-loading :showing="!totals.totalSales">
            <q-spinner-audio color="primary" size="2em" />
          </q-inner-loading>
        </q-card>
      </div>

      <q-card class="col q-mx-sm">
        <q-card-section><ChartSales ref="chart" /></q-card-section>
      </q-card>
    </div>
  </LayoutPage>
</template>
