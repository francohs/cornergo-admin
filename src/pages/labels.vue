<script setup>
import { onMounted, ref } from 'vue'

const tableRef = ref({})

const table = updates.updatesTable

onMounted(async () => {})

const onDate = async () => {
  await updates.getProceLabels()
}

const columns = [
  { label: 'CODIGO', name: 'code' },
  { label: 'NOMBRE', name: 'name' },
  { label: 'PRECIO', name: 'price' }
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
              <div class="text-h6 q-mr-md">Etiquetas de Precio</div>
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

        <labels />
      </q-card>
      <Table
        :columns="columns"
        ref="tableRef"
        loadingText="Sincronizando dtes..."
        noDataText="Sin resultados, puedes filtrar dtes por folio, proveedor o fecha de emisión"
        class="col"
      >
        <template v-slot="{ props }">
          <Cell field="code" :cell="props" />
          <Cell field="name" :cell="props" />
          <Cell field="price" :cell="props" format="currency" />
        </template>
      </Table>
    </div>
  </LayoutPage>
</template>
