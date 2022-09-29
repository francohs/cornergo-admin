<script setup>
import { jsPDF } from 'jspdf'
import { onMounted, ref, provide, nextTick } from 'vue'
import { useProductsUpdates } from 'src/stores/productsupdates'
import formatter from 'tools/formatter'

const tableRef = ref(null)
const date = ref(formatter.date(new Date()))
const priceLabels = ref([])
const loading = ref(false)

const productsUpdates = useProductsUpdates()
provide(productsUpdates.$id, productsUpdates)

// const provider = ref(null)

onMounted(() => onDate())

const columns = [
  { label: 'CODIGO', name: 'code' },
  { label: 'PROVEEDORES', name: 'providers' },
  { label: 'NOMBRE', name: 'name' },
  { label: 'PRECIO', name: 'newValue' }
]

async function onDate() {
  loading.value = true
  let data = await productsUpdates.getPriceLabels(date.value)
  priceLabels.value = data
  await nextTick()
  loading.value = false
}

function printLabels() {
  // const letterWidth = 216
  // const letterHeigh = 280
  const labelWidth = 72
  const labelHeigh = 40
  const priceHeigth = 28
  const rows = 7
  const cols = 3
  const labelsPerPage = rows * cols
  const maxCharacters = 31

  const pdf = new jsPDF({ format: 'letter' })

  const pages = Math.ceil(priceLabels.value.length / labelsPerPage)

  let labelCount = 0
  for (let page = 0; page <= pages; page++) {
    for (let y = 0; y <= labelHeigh * (rows - 1); y += labelHeigh) {
      for (let x = 0; x <= labelWidth * (cols - 1); x += labelWidth) {
        pdf.rect(x, y, labelWidth, labelHeigh)

        pdf.line(x, y + priceHeigth, x + labelWidth, y + priceHeigth)

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(46)
        pdf.text(
          formatter.currency(priceLabels.value[labelCount].newValue),
          x + labelWidth / 2,
          y + priceHeigth / 2,
          {
            align: 'center',
            baseline: 'middle'
          }
        )

        const yName =
          priceLabels.value[labelCount].name.length > maxCharacters ? 30 : 32

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.text(
          priceLabels.value[labelCount].name.replace(' G', 'G'),
          x + labelWidth / 2,
          y + yName,
          {
            align: 'center',
            baseline: 'top',
            maxWidth: labelWidth - 4
          }
        )
        labelCount++
        if (labelCount == priceLabels.value.length) break
      }
      if (labelCount == priceLabels.value.length) break
    }
    if (labelCount == priceLabels.value.length) break
    pdf.addPage('letter', 'portrait')
  }

  // pdf.autoPrint()
  pdf.save(`PRECIOS ${date.value}.pdf`)
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
              <q-icon name="sell" size="sm" class="q-mr-sm" />
              <div class="text-h6 q-mr-md">Cambios de Precios</div>
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

        <!-- <SelectProvider v-model="provider" class="full-width q-mb-lg" /> -->

        <q-btn label="GENERAR PDF" color="primary" @click="printLabels" />
      </q-card>
      <Table
        :rows="priceLabels"
        :columns="columns"
        ref="tableRef"
        loadingText="Obteniendo datos..."
        noDataText="Puedes filtrar por día o por proveedor"
        :hide-bottom="!!priceLabels.length"
        class="col"
        :rows-per-page-options="[0]"
        :loading="loading"
        :key="loading"
      >
        <template v-slot="{ props }">
          <Cell field="code" :cell="props" />
          <CellProviders :cell="props" />
          <Cell field="name" :cell="props" />
          <Cell field="newValue" :cell="props" format="currency" />
        </template>
      </Table>
    </div>
  </LayoutPage>
</template>
