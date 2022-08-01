<script setup>
import { useProducts } from 'stores/products'
import { useInventory } from 'stores/inventory'
import { useProviders } from 'stores/providers'
import { provide, ref } from 'vue'
import CellChecked from './components/CellChecked.vue'

const products = useProducts()
provide(products.$id, products)
const inventory = useInventory()
provide(inventory.$id, inventory)
const providers = useProviders()
provide(providers.$id, providers)

const CellCheckedRef = ref(null)

const columns = [
  { label: 'DETALLE', name: '_id', size: 50 },
  { label: 'CODIGO', name: 'code' },
  { label: 'NOMBRE', name: 'name', align: 'left' },
  { label: 'CATEGORÍA', name: 'category' },
  { label: 'STOCK', name: 'stock' },
  { label: 'MÍNIMO', name: 'minimum' },
  { label: 'VITRINA', name: 'showcase' },
  { label: 'ÚLTIMA COMPRA', name: 'lastBuy' },
  { label: 'ÚLTIMA VENTA', name: 'lastSale' },
  { label: 'VENTAS SEMANAL', name: 'sale' },
  { label: 'VENTAS PROMEDIO', name: 'saleAvg' },
  { label: 'VENTAS TOTAL', name: 'totalSales' },
  { label: 'ACTIVO', name: 'active' },
  { label: 'REVISADO', name: 'checked' }
]

const queryDocs = async provider => {
  if (provider) {
    await inventory.getDocs(provider)
  }
}
</script>

<template>
  <q-page>
    <TableQuery
      :storeId="inventory.$id"
      :columns="columns"
      title="Inventario"
      titleIcon="fact_check"
      inputPlaceholder="Buscar producto..."
      noDataText="Busca por proveedor y luego puedes filtrar por producto"
      tableName="inventoryTable"
    >
      <template v-slot:extracontrols>
        <SelectProvider
          label="Proveedor"
          icon="local_shipping"
          v-model="inventory.provider"
          @update:modelValue="queryDocs"
          style="width: 240px"
          autofocus
          clearable
        />
      </template>

      <template v-slot="{ props }">
        <CellLink field="_id" :name="products.$id" :cell="props" />
        <Cell field="code" :cell="props" />
        <CellInput field="name" :storeId="products.$id" :cell="props" />
        <CellInput field="category" :storeId="products.$id" :cell="props" />
        <CellInput
          field="stock"
          :storeId="products.$id"
          :cell="props"
          @editOutChange="CellCheckedRef.stockChanged(props.row._id)"
          format="decimal"
        />
        <CellInput field="minimum" :storeId="products.$id" :cell="props" />
        <CellInput field="showcase" :storeId="products.$id" :cell="props" />
        <Cell
          field="lastBuy"
          format="localDate"
          :storeId="products.$id"
          :cell="props"
        />
        <Cell
          field="lastSale"
          format="localDate"
          :storeId="products.$id"
          :cell="props"
        />
        <Cell field="sale" :storeId="products.$id" :cell="props" />
        <Cell field="saleAvg" :storeId="products.$id" :cell="props" />
        <Cell
          field="totalSales"
          format="decimal"
          :storeId="products.$id"
          :cell="props"
        />
        <CellToggle field="active" :storeId="products.$id" :cell="props" />
        <CellChecked :cell="props" ref="CellCheckedRef" />
      </template>
    </TableQuery>
  </q-page>
</template>
