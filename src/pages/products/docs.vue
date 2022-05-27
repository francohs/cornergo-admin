<template>
  <q-page>
    <TableQueryLazy
      tableName="productsTable"
      :storeId="products.$id"
      :columns="columns"
      title="Productos"
      titleIcon="widgets"
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
          v-model="products.productsTable.equalFilter.provider"
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
        <CellInput field="provider" :storeId="products.$id" :cell="props" />
        <CellInput field="lastBuy" :storeId="products.$id" :cell="props" />
        <CellInput field="lastSell" :storeId="products.$id" :cell="props" />
        <CellInput field="totalSells" :storeId="products.$id" :cell="props" />
        <CellToggle field="active" :storeId="products.$id" :cell="props" />
      </template>
    </TableQueryLazy>
  </q-page>
</template>

<script setup>
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'
import { provide, ref } from 'vue'

const products = useProducts()
const providers = useProviders()
provide(products.$id, products)
provide(providers.$id, providers)

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
  { label: 'PROVEEDOR', name: 'provider' },
  { label: 'ÚLTIMA COMPRA', name: 'lastBuy' },
  { label: 'ÚLTIMA VENTA', name: 'lastSell' },
  { label: 'VENTAS', name: 'totalSells' },
  { label: 'ACTIVO', name: 'active', size: 50 }
]
</script>
