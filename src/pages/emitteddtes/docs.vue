<script setup>
import { onMounted, provide, ref } from 'vue'
import { useEmittedDtes } from 'stores/emitteddtes'
import { useProviders } from 'stores/providers'
import formatter from 'tools/formatter'

const emittedDtes = useEmittedDtes()
provide(emittedDtes.$id, emittedDtes)
const providers = useProviders()
provide(providers.$id, providers)

const emittedDtesTable = ref({})

const table = emittedDtes.emittedDtesTable

const initDate = () => {
  table.dateFilter.value = formatter.date(new Date())
  table.visibles = table.visibles.filter(field => field != 'emissionDate')
}

const clearDate = () => {
  table.dateFilter.value = null
  table.visibles.push('emissionDate')
}

onMounted(async () => {
  initDate()
  await emittedDtesTable.value.queryInit()
})

const onDate = async () => {
  table.visibles = table.visibles.filter(field => field != 'emissionDate')
  table.equalFilter.providerAlias = null
  table.input = ''
  await emittedDtesTable.value.queryInit()
}

const onInput = async () => {
  if (table.input) {
    table.equalFilter.providerAlias = null
    clearDate()
  } else {
    initDate()
  }
  await emittedDtesTable.value.queryInit()
}

const onFilter = async () => {
  if (table.equalFilter.providerAlias) {
    table.input = ''
    clearDate()
  } else {
    initDate()
  }
  await emittedDtesTable.value.queryInit()
}

const columns = [
  { label: 'DETALLE', name: '_id', size: 100 },
  { label: 'TIPO', name: 'dteTypeName', size: 250 },
  { label: 'EMISIÓN', name: 'emissionDate', size: 250 },
  { label: 'HORA', name: 'time' },
  { label: 'FOLIO', name: 'number' },
  { label: 'ID BSALE', name: 'bsaleId' },
  { label: 'VENDEDOR', name: 'sellerName' },
  { label: 'CLIENTE', name: 'client' },
  { label: 'EXCENTO', name: 'exemptAmount', align: 'right' },
  { label: 'NETO', name: 'netAmount', align: 'right' },
  { label: 'IVA', name: 'taxAmount', align: 'right' },
  { label: 'TOTAL', name: 'totalAmount', align: 'right' },
  { label: 'VUELTO', name: 'changeAmount', align: 'right' },
  { label: 'PDF', name: 'pdfUrl' },
  { label: 'XML', name: 'xmlUrl' }
]
</script>

<template>
  <LayoutPage>
    <div class="row items-start">
      <q-card
        style="width: 338px"
        class="row column q-px-lg q-pt-sm q-pb-lg q-mr-sm"
      >
        <div
          class="row items-center justify-between text-grey-8 q-mt-md q-mb-lg full-width"
        >
          <div class="row items-center">
            <q-icon name="receipt_long" size="sm" class="q-mr-sm" />
            <div class="text-h6 q-mr-md">DTEs Emitidos</div>
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

        <Calendar
          v-model="table.dateFilter.value"
          @update:modelValue="onDate"
        />
        <q-separator />
      </q-card>
      <TableQueryLazy
        tableName="emittedDtesTable"
        :storeId="emittedDtes.$id"
        :columns="columns"
        inputOnlynumbers
        :minInput="1"
        :forceSort="{ emissionDate: -1 }"
        ref="emittedDtesTable"
        loadingText="Sincronizando dtes..."
        noDataText="Sin resultados, puedes filtrar dtes por folio, proveedor o fecha de emisión"
        class="col"
      >
        <template v-slot:extracontrols>
          <InputTable
            v-model="table.input"
            placeholder="Buscar DTE por folio..."
            debounce="500"
            style="width: 268px"
            @update:modelValue="onInput"
            :onlynumbers="true"
            class="q-mr-md"
          />

          <!-- <SelectInputFetch
            lazy
            fetchAll
            :storeId="providers.$id"
            v-model="table.equalFilter.providerAlias"
            field="alias"
            label="Proveedor"
            icon="local_shipping"
            style="width: 240px"
            @update:modelValue="onFilter"
          /> -->
        </template>

        <template v-slot="{ props }">
          <CellLink field="_id" :name="emittedDtes.$id" :cell="props" />
          <Cell field="dteTypeName" :cell="props" />
          <q-td key="emissionDate" :props="props">
            <slot>
              {{ formatter.localDate(props.row.emissionDate) }}
            </slot>
          </q-td>
          <q-td key="time" :props="props">
            <slot>
              {{ formatter.time(props.row.emissionDate) }}
            </slot>
          </q-td>
          <Cell field="number" :cell="props" />
          <Cell field="bsaleId" :cell="props" />
          <Cell field="sellerName" :cell="props" />
          <q-td key="client" :props="props">
            <slot>
              {{ props.row.client ? props.row.client.name : '' }}
            </slot>
          </q-td>

          <Cell field="exemptAmount" format="currency" :cell="props" />
          <Cell field="netAmount" format="currency" :cell="props" />
          <Cell field="taxAmount" format="currency" :cell="props" />
          <Cell field="totalAmount" format="currency" :cell="props" />
          <Cell field="changeAmount" format="currency" :cell="props" />

          <CellLink
            field="pdfUrl"
            :cell="props"
            :url="props.row.pdfUrl"
            noLink="Sin PDF"
          />
          <CellLink
            field="xmlUrl"
            :cell="props"
            :url="props.row.xmlUrl"
            noLink="Sin XML"
          />
        </template>
      </TableQueryLazy>
    </div>
  </LayoutPage>
</template>
