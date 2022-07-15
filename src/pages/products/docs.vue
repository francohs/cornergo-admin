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
  { label: 'VITRINA', name: 'showcase' },
  { label: 'MÍNIMO', name: 'minimum' },
  { label: 'COSTO', name: 'cost' },
  { label: '% MARGEN', name: 'marginRate' },
  { label: 'PRECIO', name: 'price' },
  { label: 'PROVEEDOR', name: 'providers' },
  { label: 'ÚLTIMA COMPRA', name: 'lastBuy' },
  { label: 'ÚLTIMA VENTA', name: 'lastSale' },
  { label: 'VENTAS', name: 'totalSales' },
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
        <SelectInputFetch
          lazy
          fetchAll
          :storeId="providers.$id"
          v-model="table.equalFilter.providers"
          @update:modelValue="onFilter"
          field="alias"
          label="Proveedor"
          icon="local_shipping"
          style="width: 240px"
        />
      </template>

      <template v-slot="{ props }">
        <CellLink field="_id" :name="products.$id" :cell="props" />
        <Cell field="code" :cell="props" />
        <CellInput field="name" :storeId="products.$id" :cell="props" />
        <CellInput field="category" :storeId="products.$id" :cell="props" />
        <CellInput field="stock" :storeId="products.$id" :cell="props" />
        <CellInput field="showcase" :storeId="products.$id" :cell="props" />
        <CellInput field="minimum" :storeId="products.$id" :cell="props" />
        <CellInput
          field="cost"
          format="currency"
          :storeId="products.$id"
          :cell="props"
        />
        <Cell field="marginRate" :storeId="products.$id" :cell="props" />
        <CellInput
          format="currency"
          field="price"
          :storeId="products.$id"
          :cell="props"
        />
        <q-td key="providers" :props="props">
          <q-chip v-for="provider in props.row.providers" :key="provider">{{
            provider
          }}</q-chip>
        </q-td>
        <CellInput field="lastBuy" :storeId="products.$id" :cell="props" />
        <CellInput
          field="lastSale"
          :storeId="products.$id"
          :cell="props"
          format="localDate"
        />
        <CellInput field="totalSales" :storeId="products.$id" :cell="props" />
        <CellToggle field="exempt" :storeId="products.$id" :cell="props" />
        <CellToggle field="active" :storeId="products.$id" :cell="props" />
      </template>
    </TableQueryLazy>
  </q-page>
</template>
