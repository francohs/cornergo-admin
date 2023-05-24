<script setup>
import { useProducts } from 'stores/products'
import { useInventory } from 'stores/inventory'
import { useProviders } from 'stores/providers'
import { useAuth } from 'stores/auth'
import { provide, ref } from 'vue'
import CellChecked from './components/CellChecked.vue'

const products = useProducts()
provide(products.$id, products)
const inventory = useInventory()
provide(inventory.$id, inventory)
const providers = useProviders()
provide(providers.$id, providers)
const auth = useAuth()
provide(auth.$id, auth)

const CellCheckedRef = ref(null)

const columns = [
  { label: 'CODIGO', name: 'code' },
  { label: 'NOMBRE', name: 'name', align: 'left' },
  { label: 'STOCK', name: 'stock' },
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
      title="Inventario General"
      titleIcon="fact_check"
      inputPlaceholder="Buscar producto..."
      noDataText="Busca por proveedor y luego puedes filtrar por producto"
      tableName="generalInventoryTable"
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
        <Cell field="code" :cell="props" />
        <CellInput field="name" :storeId="products.$id" :cell="props" />
        <CellInput
          field="stock"
          :storeId="products.$id"
          :cell="props"
          @editOutChange="CellCheckedRef.stockChanged(props.row._id)"
          format="decimal"
        />
        <CellChecked :cell="props" ref="CellCheckedRef" />
      </template>
    </TableQuery>
  </q-page>
</template>
