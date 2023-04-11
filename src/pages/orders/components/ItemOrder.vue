<script setup>
import { computed, inject, ref } from 'vue'
import formatter from 'tools/formatter'
import Dialog from 'src/components/Dialog.vue'
import { useAuth } from 'stores/auth'

const props = defineProps(['product'])

const { product } = props
const { supply } = product
const supplies = inject('supplies')
const auth = useAuth()
const dialog = ref(false)

supply.units = computed(() => {
  if (!supply) return 0
  return supply.packageQuantity * supply.orderQuantity
})
supply.subtotal = computed(() => {
  if (!supply) return 0
  return supply.units * supply.cost
})
const lastOrdered = computed(() => {
  const message = `${product.lastOrdered.quantity} ${product.lastOrdered.unit}`
  const units =
    product.lastOrdered.unit == 'UND'
      ? ''
      : ` (${product.lastOrdered.packageQuantity})`
  return message + units
})
const lastReceived = computed(() => {
  const message = `${product.lastReceived.quantity} ${product.lastReceived.unit}`
  const units =
    product.lastReceived.unit == 'UND'
      ? ''
      : ` (${product.lastReceived.packageQuantity})`
  return message + units
})

const activeSupplies = computed(
  () => product.supplies.filter(s => s.active).length
)

async function removeSupply(id) {
  await supplies.delete(id)
  product.supplies = product.supplies.filter(s => s._id != id)
}
</script>

<template>
  <q-item v-bind="$attrs" style="border-color: grey" class="bg-white">
    <div class="full-width row q-gutter-y-sm q-py-sm">
      <div class="full-width row justify-between" v-if="product._id">
        <div class="row q-gutter-x-sm">
          <InputRead
            label="Código"
            :modelValue="product.code"
            width="180"
            dense
          />
          <Input
            label="Nombre Producto"
            v-model="product.name"
            storeId="products"
            :id="product._id"
            field="name"
            :hint="`Creado ${formatter.localDate(product.createdAt)}`"
            input-style="font-size: 14px;"
            width="400"
            dense
          />
          <Input
            label="Stock"
            v-model="product.stock"
            storeId="products"
            :id="product._id"
            field="stock"
            width="90"
            dense
          />
          <!-- <Input
            label="Mínimo"
            v-model="product.minimum"
            storeId="products"
            :id="product._id"
            field="minimum"
            width="90"
            dense
          /> -->
          <Input
            label="Vitrína"
            v-model="product.showcase"
            storeId="products"
            :id="product._id"
            field="showcase"
            width="90"
            dense
          />
          <InputRead
            label="Venta Sem"
            :modelValue="product.weekSale"
            width="90"
            dense
          />

          <InputRead
            label="Venta Prom"
            :modelValue="product.weekSaleAvg"
            :hint="`Total ${product.totalSales}`"
            width="90"
            dense
          />
          <InputRead
            label="Margen Sem"
            :modelValue="product.weekMargin"
            width="90"
            format="currency"
            dense
          />
          <InputRead
            label="Margen Prom"
            :modelValue="product.marginAvg"
            width="90"
            format="currency"
            dense
          />
          <InputRead
            :label="product.lastOrdered.providerAlias"
            v-if="product.lastOrdered"
            :modelValue="lastOrdered"
            :hint="`Pedido ${formatter.localDate(
              product.lastOrdered.updatedAt
            )}`"
            width="140"
            dense
          />
          <InputRead
            :label="product.lastReceived.providerAlias"
            v-if="product.lastReceived"
            :modelValue="lastReceived"
            :hint="`Recepción ${formatter.localDate(
              product.lastReceived.updatedAt
            )}`"
            width="140"
            dense
          />
          <div class="column items-center text-grey-7" style="font-size: 12px">
            Activo
            <Toggle
              storeId="products"
              :id="product._id"
              field="active"
              v-model="product.active"
              size="sm"
              dense
            />
          </div>
        </div>
      </div>

      <div class="full-width row justify-between" v-if="supply">
        <div class="row q-gutter-x-sm">
          <InputRead
            label="SKU"
            :modelValue="supply.sku"
            width="180"
            dense
            bold
          />
          <InputRead
            label="Nombre Suministro"
            :modelValue="supply.name"
            :hint="`Creado ${formatter.localDate(supply.createdAt)}`"
            input-style="font-size: 14px;"
            width="400"
            dense
            bold
          />
          <InputRead
            label="Pedido"
            :modelValue="supply.orderQuantity"
            width="90"
            dense
            bold
          />
          <Input
            label="Unidad"
            v-model="supply.unit"
            storeId="supplies"
            :id="supply._id"
            field="unit"
            width="120"
            dense
            bold
          />
          <Input
            label="Cnt x Pack"
            v-model="supply.packageQuantity"
            storeId="supplies"
            :id="supply._id"
            field="packageQuantity"
            width="90"
            dense
          />
          <InputRead
            label="Unidades"
            :modelValue="supply.units"
            width="90"
            dense
          />
          <InputRead
            label="Costo Producto"
            :modelValue="supply.cost"
            width="100"
            format="currency"
            dense
          />
          <InputRead
            label="Subtotal"
            :modelValue="supply.subtotal"
            width="120"
            format="currency"
            dense
          />
          <div>
            <q-btn
              v-if="product.supplies.length > 1"
              :label="`ALTERNATIVAS (${activeSupplies}/${product.supplies.length})`"
              size="sm"
              :class="activeSupplies > 1 ? 'bg-primary text-white' : ''"
              @click="dialog = true"
            />
            <!-- rounded -->
          </div>
        </div>
      </div>
    </div>
  </q-item>

  <Dialog
    v-model="dialog"
    no-footer
    :title="`${product.name} ${formatter.currency(
      product.price
    )} (PROVEEDORES)`"
    width="1400"
  >
    <Table
      :rows="product.supplies"
      :columns="[
        // { label: '', name: 'remove' },
        { label: 'SKU', name: 'sku' },
        { label: 'PROVEEDOR', name: 'providerAlias', align: 'left' },
        { label: 'NOMBRE', name: 'name', align: 'left' },
        { label: 'MEDIDA', name: 'unit' },
        { label: 'UNIDADES', name: 'packageQuantity' },
        { label: 'COSTO', name: 'cost' },
        { label: 'MARGEN', name: 'pmargin' },
        { label: 'RECIBIDO', name: 'lastReceived.updatedAt' },
        { label: 'ACTIVO', name: 'active', size: 50 }
      ]"
      hide-bottom
      flat
      bordered
      class="q-mb-lg"
    >
      <template v-slot="{ props }">
        <!-- <q-td key="remove">
          <div style="padding-top: 5px">
            <q-btn
              dense
              round
              flat
              icon="clear"
              color="grey-7"
              @click="removeSupply(props.row._id)"
              v-if="auth.isAdmin"
            />
          </div>
        </q-td> -->
        <Cell field="sku" :cell="props" />
        <Cell field="providerAlias" :cell="props" />
        <Cell field="name" :cell="props" />
        <Cell field="unit" :cell="props" />
        <Cell field="packageQuantity" :cell="props" />
        <Cell field="cost" format="currency" :cell="props" />
        <Cell field="pmargin" :cell="props" v-if="product.price"
          ><ValuePercent
            :value="product.price"
            :total="props.row.cost"
            :high="40"
            :low="30"
        /></Cell>
        <Cell field="lastReceived.updatedAt" format="localDate" :cell="props" />
        <CellToggle
          field="active"
          :storeId="supplies.$id"
          :cell="props"
          v-model="props.row.active"
        />
      </template>
    </Table>
  </Dialog>
</template>
