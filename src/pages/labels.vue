<script setup>
import { jsPDF } from 'jspdf'
import { onMounted, ref, provide } from 'vue'
import { useUpdates } from 'stores/updates'
import formatter from 'tools/formatter'

const tableRef = ref({})
const date = ref(formatter.date(new Date()))
const priceLabels = ref([])
const loading = ref(false)

const updates = useUpdates()
provide(updates.$id, updates)

onMounted(async () => {})

const onDate = async () => {
  loading.value = true
  priceLabels.value = await updates.getPriceLabels()

  const letterWidth = 216
  const letterHeigh = 280
  const labelWidth = 72
  const labelHeigh = 40
  const priceHeigth = 28
  const rows = 7
  const cols = 3
  const labelsPerPage = rows * cols
  const maxCharacters = 31

  const pdf = new jsPDF({ format: 'letter' })

  // const price = '$ 2.690'
  // const description = 'DESODORANTE OLD SPICE BARRA 600'
  // const description = 'DESODORANTE OLD SPICE BARRA HIPOALEGENICO 60 G'

  // const priceLabels = []
  // for (let n = 0; n < 45; n++) {
  //   priceLabels.push({
  //     price,
  //     description
  //   })
  // }

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
          formatter.currency(priceLabels.value[labelCount].price),
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

  // pdf.rect(0, 270, labelWidth, 10)

  // pdf.autoPrint()
  pdf.save(`PRECIOS ${date.value}.pdf`)
  loading.value = false
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

        <q-separator />
      </q-card>
      <Table
        :rows="priceLabels"
        :columns="columns"
        ref="tableRef"
        loadingText="Sincronizando dtes..."
        noDataText="Selecciona un dia para ver los cambios de precio"
        :hide-bottom="!!priceLabels.length"
        class="col"
        :pagination="{ rowsPerPage: 0 }"
        :loading="loading"
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
