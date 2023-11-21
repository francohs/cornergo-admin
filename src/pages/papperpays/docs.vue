<script setup>
import formatter from 'tools/formatter'
import { usePapperPays } from 'stores/papperpays'
import { onMounted, provide, ref } from 'vue'
import moment from 'moment'

const date = ref(formatter.date(new Date()))
const month = ref(moment().format('MM'))
const year = ref(moment().format('YYYY'))

const papperPays = usePapperPays()
provide(papperPays.$id, papperPays)

onMounted(() => onDate())

const columns = [
  { label: 'RAZÓN SOCIAL', name: 'providerName' },
  { label: 'FACTURAS', name: 'dtesNumbers' },
  { label: 'NÚMERO CHEQUE', name: 'number' },
  { label: 'MONTO TOTAL', name: 'amount' },
  { label: 'VERIFICADO', name: 'verified' }
]

async function onDate() {
  await papperPays.getDocs(date.value)
}

async function onMonthView() {
  await papperPays.getDocsByMonth(month.value, year.value)
}
</script>

<template>
  <LayoutPage>
    <div class="row items-start">
      <q-card
        style="width: 338px"
        class="row column q-px-lg q-pt-sm q-pb-lg q-mr-sm"
      >
        <div>
          <div
            class="row items-center justify-between text-grey-8 q-mt-md q-mb-lg full-width"
          >
            <div class="row items-center">
              <q-icon name="account_balance" size="sm" class="q-mr-sm" />
              <div class="text-h6 q-mr-md">Cheques</div>
            </div>

            <q-btn
              dense
              flat
              rounded
              icon="refresh"
              color="primary"
              @click="onDate"
            />
          </div>

          <q-separator />
        </div>

        <Calendar v-model="date" @update:modelValue="onDate" />

        <q-separator class="q-mb-md" />

        <!-- <div class="text-subtitle q-mb-sm text-grey-8">Vista Mensual</div> -->

        <q-btn class="q-mb-sm" @click="onMonthView">Vista Mensual</q-btn>
        <div class="row">
          <SelectMonth
            v-model="month"
            @update:model-value="onMonthView"
            dense
            width="150"
          />
          <SelectYear
            v-model="year"
            @update:model-value="onMonthView"
            dense
            width="130"
            class="q-ml-sm"
          />
        </div>

        <q-separator class="q-my-md" />

        <q-btn color="primary">Ingresar Cartola</q-btn>
        <!-- <q-btn class="q-mt-md">Ingresar Cheque</q-btn> -->
      </q-card>
      <Table
        :rows="papperPays.docs"
        :columns="columns"
        loadingText="Obteniendo datos..."
        noDataText="Aún no hay cheques para este día"
        :hide-bottom="!!papperPays.countDocs"
        :rows-per-page-options="[0]"
        :loading="papperPays.loading"
        :key="papperPays.loading"
        class="col"
      >
        <template v-slot="{ props }">
          <Cell field="providerName" :cell="props" />
          <q-td key="dtesNumbers" :props="props">
            {{
              props.row.dtesNumbers.length > 2
                ? props.row.dtesNumbers.slice(0, 2).join(', ') + ', ...'
                : props.row.dtesNumbers.join(', ')
            }}
            <q-tooltip v-if="props.row.dtesNumbers.length > 2">{{
              props.row.dtesNumbers.join(', ')
            }}</q-tooltip>
          </q-td>
          <CellInput field="number" :storeId="papperPays.$id" :cell="props" />
          <CellInput
            field="amount"
            :storeId="papperPays.$id"
            :cell="props"
            format="currency"
          />
          <CellVerified
            field="verified"
            :storeId="papperPays.$id"
            :cell="props"
          />
        </template>
      </Table>
    </div>
  </LayoutPage>
</template>
