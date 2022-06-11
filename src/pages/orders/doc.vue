<template>
  <LayoutPage :loading="orders.loading" class="q-pa-md">
    <div class="text-h4 q-mb-md">
      <div class="row">
        Pedido {{ provider }} {{ orderDate }}
        <q-space />
        <q-btn
          label="GENERAR PDF"
          icon="sim_card_download"
          @click="genPDF"
          color="positive"
        />
      </div>

      <div class="q-pt-md">
        <q-banner inline-actions rounded class="bg-orange text-white">
          Existen <b>{{ checkStockCount }}</b> productos con stock posiblemente
          erroneo

          <template v-slot:action>
            <q-btn
              flat
              label="Revisar Stock"
              @click="goto"
              icon="fact_check"
              :loading="loadingGoto"
            />
          </template>
        </q-banner>
      </div>
    </div>
    <q-list
      bordered
      separator
      class="rounded-borders"
      style="border-color: grey"
    >
      <ItemOrder
        :product="product"
        v-for="product of orders.doc.order"
        :key="product._id"
      />
    </q-list>
  </LayoutPage>
</template>

<script setup>
import { jsPDF } from 'jspdf'
import { onMounted, provide, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrders } from 'stores/orders'
import { useProducts } from 'stores/products'
import { useSupplies } from 'stores/supplies'
import { useInventory } from 'stores/inventory'
import formatter from 'tools/formatter'
import ItemOrder from './components/ItemOrder.vue'

const route = useRoute()
const router = useRouter()

const orders = useOrders()
provide(orders.$id, orders)
const products = useProducts()
provide(products.$id, products)
const supplies = useSupplies()
provide(supplies.$id, supplies)
const inventory = useInventory()

const id = route.params.id
const order = reactive({})
const provider = ref('')
const checkStockCount = ref(0)
const loadingGoto = ref(false)
const orderDate = formatter.localDate(new Date())

provide(orders.$id, orders)

onMounted(async () => {
  try {
    await orders.getDoc(id)
    Object.assign(order, orders.doc)
    provider.value = orders.doc.provider.alias
    checkStockCount.value = orders.doc.checkStock.length
  } catch (error) {
    console.error(error)
  }
})

const goto = async () => {
  loadingGoto.value = true
  await inventory.getDocs(provider.value)
  loadingGoto.value = false
  inventory.provider = provider
  router.push({ name: 'inventory' })
}

const genPDF = () => {
  const pdf = new jsPDF({ format: 'letter' })

  const title = `PEDIDO ${provider.value} ${orderDate}`
  pdf.setFont('helvetica', 'bold')
  pdf.text(title, 5, 10)

  const data = orders.doc.order.reduce((prev, curr) => {
    const { supply } = curr
    if (!supply) return prev
    return [
      ...prev,
      {
        sku: supply.sku || '-',
        name: supply.name || '',
        quantity: supply.orderQuantity ? supply.orderQuantity.toString() : '-',
        unit: supply.unit || '-'
      }
    ]
  }, [])

  console.log(data)

  const headers = [
    { name: 'sku', prompt: 'SKU', align: 'center', width: 50 },
    { name: 'name', prompt: 'NOMBRE', width: 145 },
    { name: 'quantity', prompt: 'CANTIDAD', align: 'center', width: 40 },
    { name: 'unit', prompt: 'UNIDAD', align: 'center', width: 40 }
  ]

  pdf.table(5, 15, data, headers)

  pdf.save(`${title}.pdf`)
}
</script>
