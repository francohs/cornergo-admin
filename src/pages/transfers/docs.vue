<script setup>
import moment from 'moment'
import { onMounted, provide, ref } from 'vue'
import { useTransfers } from 'stores/transfers'
import CellNumberMatch from './components/CellNumberMatch.vue'

const transfers = useTransfers()
provide(transfers.$id, transfers)

const tableRef = ref({})
const month = ref('07')
const year = ref('2023')
const file = ref(null)
const filePickerRef = ref(null)
const uploading = ref(false)

onMounted(async () => {
  month.value = moment().subtract(1, 'month').format('MM')
  year.value = moment().format('YYYY')

  await transfers.getDocs(month.value, year.value)
})

async function onDate() {
  await transfers.getDocs(month.value, year.value)
}

async function onUpload() {
  try {
    uploading.value = true
    await transfers.uploadBankTransfers(file.value)
  } finally {
    file.value = null
    uploading.value = false
    filePickerRef.value.blur()
  }
}

async function check(id) {
  await transfers.update(id, {
    verified: true
  })
}

const columns = [
  { label: 'BOLETA', name: 'dte', size: 100 },
  { label: 'FOLIO', name: 'dteNumber' },
  { label: 'EMISIÓN', name: 'emissionDate' },
  { label: 'FECHA BANCO', name: 'bankDate' },
  { label: 'MONTO', name: 'amount' },
  { label: 'MONTO BANCO', name: 'bankAmount' },
  { label: 'CLIENTE', name: 'clientName' },
  { label: 'OPERACIÓN', name: 'operationNumber' },
  { label: 'VERIFICADO', name: 'verified' }
]
</script>

<template>
  <LayoutPage>
    <Table
      :rows="transfers.docs"
      :columns="columns"
      loadingText="Obteniendo datos..."
      noDataText="Selecciona mes y año de trasferencias"
      :hide-bottom="!!transfers.docs.length"
      :rows-per-page-options="[0]"
      :loading="transfers.loading"
      :key="transfers.loading || transfers.matching"
      ref="tableRef"
      class="col"
    >
      <template v-slot:top>
        <div class="full-width row items-center justify-between">
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="account_balance" size="sm" class="q-mx-none" />
            <div class="text-h6 q-mr-md">Transferencias</div>

            <SelectMonth v-model="month" @update:model-value="onDate" />
            <SelectYear v-model="year" @update:model-value="onDate" />

            <q-file
              label="Subir Cartola"
              v-model="file"
              @update:model-value="onUpload"
              :loading="uploading"
              outlined
              style="width: 250px"
              ref="filePickerRef"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
            </q-file>
          </div>

          <div v-if="transfers.docs.length" class="text-h6">
            DTE: {{ transfers.dteNotVerified }} / BANCO:
            {{ transfers.bankNotVerified }} / TOTAL: {{ transfers.countDocs }}
          </div>
        </div>
      </template>

      <template v-slot="{ props }">
        <CellLink
          field="dte"
          :cell="props"
          :url="props.row.dte ? `emitteddtes/${props.row.dte}` : null"
          blank
        />
        <Cell v-if="props.row.dteNumber" field="dteNumber" :cell="props" />
        <CellNumberMatch v-else :cell="props" />
        <Cell field="emissionDate" :cell="props" format="localDate" />
        <Cell field="bankDate" :cell="props" format="localDate" />
        <Cell field="amount" :cell="props" format="currency" />
        <Cell field="bankAmount" :cell="props" format="currency" />
        <Cell field="clientName" :cell="props" />
        <Cell field="operationNumber" :cell="props" />
        <q-td key="verified" :props="props">
          <q-btn
            flat
            rounded
            size="md"
            icon="check_circle"
            :color="props.row.verified ? 'positive' : 'negative'"
            @click="check(props.row._id)"
          />
        </q-td>
      </template>
    </Table>
  </LayoutPage>
</template>
