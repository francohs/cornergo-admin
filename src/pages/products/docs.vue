<script setup>
import { ref, provide } from 'vue'
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'

const tableRef = ref({})

const products = useProducts()
const table = products.productsTable
const providers = useProviders()
provide(products.$id, products)
provide(providers.$id, providers)

const onFilter = async provider => {
  if (!provider) {
    table.pagination.page = 1
    products.clearDocs()
    return
  }
  await tableRef.value.queryInit()
}

const columns = [
  { label: 'DETALLE', name: '_id', size: 50 },
  { label: 'CODIGO', name: 'code' },
  { label: 'NOMBRE', name: 'name', align: 'left' },
  { label: 'CATEGORÍA', name: 'category' },
  { label: 'STOCK', name: 'stock' },
  // { label: 'MÍNIMO', name: 'minimum' },
  { label: 'COSTO', name: 'cost' },
  // { label: '% MARGEN', name: 'marginRate' },
  { label: 'PRECIO', name: 'price' },
  { label: 'PRECIO BAT', name: 'batPrice' },
  { label: 'PROVEEDOR', name: 'providers' },
  { label: 'VITRINA', name: 'showcase' },
  // { label: 'ROTACIÓN', name: 'weekSale' },
  // { label: 'ROT PROM', name: 'weekSaleAvg' },
  // { label: 'MARGEN', name: 'marginAvg' },
  // { label: 'MARGEN MAX', name: 'marginMax' },
  { label: 'VENTAS', name: 'totalSales' },
  { label: 'CREACIÓN', name: 'createdAt' },
  { label: 'ÚLTIMA COMPRA', name: 'lastReceive.updatedAt' },
  { label: 'ÚLTIMA VENTA', name: 'lastSale' },
  { label: 'EXENTO', name: 'exempt', size: 50 },
  { label: 'ACTIVO', name: 'active', size: 50 }
]
</script>

<template>
  <q-page class="q-pa-md">
    <TableQueryLazy
      tableName="productsTable"
      ref="tableRef"
      :storeId="products.$id"
      :columns="columns"
      title="Productos"
      titleIcon="widgets"
      withInput
      inputPlaceholder="Buscar producto..."
      noDataText="Puedes filtrar productos por nombre o codigo"
      activeToggle
      createBtn
    >
      <template v-slot:extracontrols>
        <SelectProvider
          v-model="table.equalFilter.providers"
          @update:modelValue="onFilter"
          label="Proveedor"
          style="width: 260px"
          icon="local_shipping"
          clearable
        />
      </template>

      <template v-slot="{ props }">
        <CellLink field="_id" :name="products.$id" :cell="props" blank />
        <Cell field="code" :cell="props" />
        <CellInput field="name" :storeId="products.$id" :cell="props" />
        <CellInput field="category" :storeId="products.$id" :cell="props" />
        <CellInput
          field="stock"
          :storeId="products.$id"
          :cell="props"
          format="decimal"
        />
        <!-- <CellInput field="minimum" :storeId="products.$id" :cell="props" /> -->
        <CellInput
          field="cost"
          format="currency"
          :storeId="products.$id"
          :cell="props"
        />
        <!-- <Cell field="marginRate" :cell="props" /> -->
        <CellInput
          format="currency"
          field="price"
          :storeId="products.$id"
          :cell="props"
        />
        <CellInput
          format="currency"
          field="batPrice"
          :storeId="products.$id"
          :cell="props"
        />
        <!-- <q-td key="providers" :props="props">
          <q-chip v-for="provider in props.row.providers" :key="provider">{{
            provider
          }}</q-chip>
        </q-td> -->
        <CellProviders :cell="props" />
        <CellInput field="showcase" :storeId="products.$id" :cell="props" />
        <!-- <Cell field="weekSale" :cell="props" />
        <Cell field="weekSaleAvg" :cell="props" />
        <Cell field="marginAvg" :cell="props" format="currency" />
        <Cell field="marginMax" :cell="props" format="currency" /> -->
        <Cell field="totalSales" :cell="props" format="decimal" />
        <Cell field="createdAt" :cell="props" format="localDate" />
        <Cell field="lastReceive.updatedAt" :cell="props" format="localDate" />
        <Cell field="lastSale" :cell="props" format="localDate" />
        <CellToggle field="exempt" :storeId="products.$id" :cell="props" />
        <CellToggle field="active" :storeId="products.$id" :cell="props" />
      </template>
    </TableQueryLazy>
  </q-page>
</template>
