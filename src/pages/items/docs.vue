<template>
  <PageResponsive :loading="items.loading">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">Items</div>
        <q-btn label="GENERAR PDF" icon="sim_card_download" @click="genPDF" />

        <ButtonLinkCreate :store="items.$id" />
      </div>

      <q-list v-if="items.docs.length > 0" bordered separator>
        <q-item
          clickable
          v-for="item of items.docs"
          :key="item._id"
          class="q-py-md"
          :to="{ name: 'items/:id', params: { id: item._id } }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              icon="person"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div
        v-if="items.docs.length == 0"
        class="q-mt-xl text-center text-grey-7"
      >
        Aún no tienes items
      </div>
    </div>
  </PageResponsive>
</template>

<script setup>
import { useItems } from 'stores/items'
import { onMounted, provide } from 'vue'
import { jsPDF } from 'jspdf'

const items = useItems()
provide(items.$id, items)

onMounted(async () => await items.getDocs())

var generateData = function (amount) {
  var result = []
  var data = {
    sku: '20485861',
    name: 'COCA-COLA ZERO PET 1500 CC',
    quantity: '24',
    unit: 'CAJA'
  }
  for (var i = 0; i < amount; i += 1) {
    result.push(data)
  }
  return result
}

const genPDF = () => {
  const pdf = new jsPDF({ format: 'letter' })

  const title = `PEDIDO COCA-COLA 31-03-2022`
  pdf.setFont('helvetica', 'bold')
  pdf.text(title, 5, 10)

  const headers = [
    { name: 'sku', prompt: 'SKU', align: 'center', width: 50 },
    { name: 'name', prompt: 'NOMBRE', width: 145 },
    { name: 'quantity', prompt: 'CANTIDAD', align: 'center', width: 40 },
    { name: 'unit', prompt: 'UNIDAD', align: 'center', width: 40 }
  ]

  pdf.table(5, 15, generateData(50), headers)

  pdf.save(`${title}.pdf`)
}
</script>
