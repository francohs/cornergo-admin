<script setup>
import { io } from 'boot/socket'
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReceivedDtes } from 'stores/receiveddtes'
import { useProviders } from 'stores/providers'
import formatter from 'tools/formatter'
import ButtonPayCalc from './components/ButtonPayCalc.vue'
import CellLinkDte from './components/CellLinkDte.vue'

const router = useRouter()

const receivedDtes = useReceivedDtes()
provide(receivedDtes.$id, receivedDtes)
const providers = useProviders()
provide(providers.$id, providers)

const tableRef = ref({})

const table = receivedDtes.receivedDtesTable

const initDate = () => {
  table.dateFilter.value = formatter.date(new Date())
  table.visibles = table.visibles.filter(field => field != 'emissionDate')
}

const clearDate = () => {
  table.dateFilter.value = null
  table.visibles.push('emissionDate')
}

onMounted(async () => {
  if (!receivedDtes.docs.length) {
    initDate()
    await tableRef.value.queryInit()
  }

  io.on('receiveDte', receivedDte => {
    const index = receivedDtes.docs.findIndex(
      rDte => rDte._id == receivedDte._id
    )
    receivedDtes.docs[index].receptionDate = receivedDte.receptionDate
  })

  io.on('newDte', () => newDte => {
    const index = receivedDtes.docs.findIndex(rDte => rDte._id == newDte._id)
    if (index > -1) {
      console.log('newDte', newDte)
      receivedDtes.docs[index] = newDte
    } else {
      console.log('newXml', newDte)
      receivedDtes.docs = [...receivedDtes.docs, newDte]
    }
  })
})

const onDate = async () => {
  table.visibles = table.visibles.filter(field => field != 'emissionDate')
  table.equalFilter.providerAlias = null
  table.input = ''
  await tableRef.value.queryInit()
}

const onInput = async () => {
  if (table.input) {
    table.equalFilter.providerAlias = null
    clearDate()
  } else {
    initDate()
  }
  await tableRef.value.queryInit()
}

const onFilter = async () => {
  if (table.equalFilter.providerAlias) {
    table.input = ''
    clearDate()
  } else {
    initDate()
  }
  await tableRef.value.queryInit()
}

const createProvider = (rut, name) => {
  providers.doc = {
    rut,
    name
  }
  router.push({ name: 'providers/create' })
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
          <div
            class="row items-center justify-between text-grey-8 q-mt-md q-mb-lg full-width"
          >
            <div class="row items-center">
              <q-icon name="file_copy" size="sm" class="q-mr-sm" />
              <div class="text-h6 q-mr-md">DTEs Recibidos</div>
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

        <Calendar
          v-model="table.dateFilter.value"
          @update:modelValue="onDate"
        />

        <div>
          <q-separator />
          <div class="row justify-center q-mt-lg">
            <ButtonPayCalc :date="table.dateFilter.value" />
          </div>
        </div>
      </q-card>
      <TableQueryLazy
        tableName="receivedDtesTable"
        :storeId="receivedDtes.$id"
        :columns="columns"
        inputOnlynumbers
        :minInput="1"
        :forceSort="{ providerName: 1, number: 1 }"
        ref="tableRef"
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

          <SelectInputFetch
            lazy
            fetchAll
            :storeId="providers.$id"
            v-model="table.equalFilter.providerAlias"
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
