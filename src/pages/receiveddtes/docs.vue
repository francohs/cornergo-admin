<script setup>
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReceivedDtes } from 'stores/receiveddtes'
import { useProviders } from 'stores/providers'
import formatter from 'tools/formatter'
import ButtonPayCalc from './components/ButtonPayCalc.vue'
import CellLinkDte from './components/CellLinkDte.vue'

const $router = useRouter()

const receivedDtes = useReceivedDtes()
provide(receivedDtes.$id, receivedDtes)
const providers = useProviders()
provide(providers.$id, providers)

const receivedDtesTable = ref({})
const date = ref('2022-06-06')

const initDate = () => {
  receivedDtes.receivedDtesTable.dateFilter.value = formatter.date(new Date())
  receivedDtes.receivedDtesTable.visibles =
    receivedDtes.receivedDtesTable.visibles.filter(
      field => field != 'emissionDate'
    )
}

const clearDate = () => {
  receivedDtes.receivedDtesTable.dateFilter.value = null
  receivedDtes.receivedDtesTable.visibles.push('emissionDate')
}

onMounted(async () => {
  initDate()
  await receivedDtesTable.value.queryInit()
})

const onDate = async () => {
  receivedDtes.receivedDtesTable.visibles =
    receivedDtes.receivedDtesTable.visibles.filter(
      field => field != 'emissionDate'
    )
  receivedDtes.receivedDtesTable.equalFilter.providerAlias = null
  receivedDtes.receivedDtesTable.input = ''
  await receivedDtesTable.value.queryInit()
}

const onInput = async () => {
  if (receivedDtes.receivedDtesTable.input) {
    receivedDtes.receivedDtesTable.equalFilter.providerAlias = null
    clearDate()
  } else {
    initDate()
  }
  await receivedDtesTable.value.queryInit()
}

const onFilter = async () => {
  if (receivedDtes.receivedDtesTable.equalFilter.providerAlias) {
    receivedDtes.receivedDtesTable.input = ''
    clearDate()
  } else {
    initDate()
  }
  await receivedDtesTable.value.queryInit()
}

const createProvider = (rut, name) => {
  providers.doc = {
    rut,
    name
  }
  $router.push({ name: 'providers/create' })
}

const columns = [
  { label: 'DETALLE', name: '_id', size: 100 },
  { label: 'EMISIÓN', name: 'emissionDate', size: 250 },
  { label: 'TIPO', name: 'dteTypeName', size: 250 },
  { label: 'FOLIO', name: 'number' },
  { label: 'ID BSALE', name: 'bsaleId' },
  { label: 'RUT', name: 'providerRut' },
  {
    label: 'RAZÓN SOCIAL',
    name: 'providerName',
    align: 'left',
    size: 300
  },
  { label: 'ALIAS', name: 'providerAlias', size: 300 },
  { label: 'EXCENTO', name: 'exemptAmount' },
  { label: 'IVA', name: 'ivaAmount' },
  { label: 'TOTAL', name: 'totalAmount', align: 'right' },
  { label: 'FORMA PAGO', name: 'paymentMethod' },
  { label: 'EXPIRACIÓN', name: 'expirationDate' },
  { label: 'PDF', name: 'pdfUrl' },
  { label: 'XML', name: 'xmlUrl' },
  { label: 'RECIBIDO', name: 'receptionDate' }
]
</script>

<template>
  <LayoutPage>
    <div class="row items-start">
      <q-card
        style="width: 338px"
        class="row column q-px-lg q-pt-sm q-pb-lg q-mr-sm"
      >
        <div>
          <div class="row items-center text-grey-8 q-mt-md q-mb-lg full-width">
            <q-icon name="file_copy" size="sm" class="q-mr-sm" />
            <div class="text-h6 q-mr-md">DTEs Recibidos</div>
          </div>

          <q-separator />
        </div>

        <Calendar
          v-model="receivedDtes.receivedDtesTable.dateFilter.value"
          @update:modelValue="onDate"
        />

        <div>
          <q-separator />
          <div class="row justify-center q-mt-lg">
            <ButtonPayCalc
              :date="receivedDtes.receivedDtesTable.dateFilter.value"
            />
          </div>
        </div>
      </q-card>
      <TableQueryLazy
        tableName="receivedDtesTable"
        :storeId="receivedDtes.$id"
        :columns="columns"
        inputOnlynumbers
        :minInput="1"
        :forceSort="{ emissionDate: -1, providerName: -1, number: -1 }"
        ref="receivedDtesTable"
        loadingText="Sincronizando dtes..."
        noDataText="Sin resultados, puedes filtrar dtes por folio, proveedor o fecha de emisión"
        class="col"
      >
        <template v-slot:extracontrols>
          <InputTable
            v-model="receivedDtes.receivedDtesTable.input"
            placeholder="Buscar DTE por folio..."
            debounce="500"
            style="width: 268px"
            @update:modelValue="onInput"
            :onlynumbers="true"
            class="q-mr-md"
          />

          <SelectInputFetch
            lazy
            fetchAll
            :storeId="providers.$id"
            v-model="receivedDtes.receivedDtesTable.equalFilter.providerAlias"
            field="alias"
            label="Proveedor"
            icon="local_shipping"
            style="width: 240px"
            @update:modelValue="onFilter"
          />
        </template>

        <template v-slot="{ props }">
          <CellLinkDte field="_id" :cell="props" />
          <Cell field="emissionDate" format="localDate" :cell="props" />
          <Cell field="dteTypeName" :cell="props" />
          <Cell field="number" :cell="props" />
          <Cell field="bsaleId" :cell="props" />
          <Cell format="rut" field="providerRut" :cell="props" />
          <Cell field="providerName" style="font-size: 12px" :cell="props" />
          <Cell
            v-if="props.row.providerAlias"
            field="providerAlias"
            :cell="props"
          />
          <Cell
            v-else
            field="providerAlias"
            style="font-size: 12px"
            :cell="props"
          >
            {{ props.row.providerName }}
            <q-btn
              icon="add"
              flat
              dense
              size="sm"
              color="positive"
              @click="
                createProvider(props.row.providerRut, props.row.providerName)
              "
            >
              <q-tooltip>Agregar proveedor</q-tooltip>
            </q-btn>
          </Cell>
          <Cell field="exemptAmount" format="currency" :cell="props" />
          <Cell field="ivaAmount" format="currency" :cell="props" />
          <Cell
            v-if="props.row.totalAmount"
            field="totalAmount"
            format="currency"
            :cell="props"
          />
          <Cell field="paymentMethod" format="currency" :cell="props" />
          <Cell field="expirationDate" format="localDate" :cell="props" />
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
          <Cell field="receptionDate" :cell="props">
            {{
              props.row.receptionDate
                ? formatter.datetime(props.row.receptionDate)
                : ''
            }}
            <q-icon
              v-if="props.row.receptionDate"
              class="q-ml-sm"
              name="check_circle"
              color="positive"
              size="sm"
            />
            <q-icon v-else name="remove_circle" color="grey" size="sm" />
          </Cell>
        </template>
      </TableQueryLazy>
    </div>
  </LayoutPage>
</template>
