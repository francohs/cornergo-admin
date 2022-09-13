<script setup>
import { ref, provide } from 'vue'
import { useProductsUpdates } from 'stores/productsupdates'
import { useUsers } from 'stores/users'

const tableRef = ref({})

const productsUpdates = useProductsUpdates()
provide(productsUpdates.$id, productsUpdates)
const users = useUsers()
provide(users.$id, users)
const table = productsUpdates.productsUpdatesTable

const onFilter = async value => {
  if (!value) {
    table.pagination.page = 1
    productsUpdates.clearDocs()
  }
  await tableRef.value.queryInit()
}

const columns = [
  { label: 'USUARIO', name: 'username' },
  { label: 'CODIGO', name: 'code' },
  { label: 'NOMBRE', name: 'name', align: 'left' },
  { label: 'PROVEEDORES', name: 'providers' },
  { label: 'CAMPO', name: 'field' },
  { label: 'ANTERIOR', name: 'oldValue' },
  { label: 'ACTUAL', name: 'newValue' },
  { label: 'FECHA', name: 'createdAt' }
]
</script>

<template>
  <q-page class="q-pa-md">
    <TableQueryLazy
      tableName="productsUpdatesTable"
      ref="tableRef"
      :storeId="productsUpdates.$id"
      :columns="columns"
      title="Productos"
      titleIcon="widgets"
      withInput
      inputPlaceholder="Buscar producto..."
      noDataText="Puedes filtrar productos por nombre o codigo"
      initFetch
      createBtn
    >
      <template v-slot:extracontrols>
        <SelectFetch
          v-model="table.equalFilter.username"
          @update:modelValue="onFilter"
          optionStore="users"
          optionLabel="username"
          optionValue="username"
          label="Usuario"
          style="width: 240px"
          clearable
        />
      </template>

      <template v-slot="{ props }">
        <Cell field="username" :cell="props" />
        <Cell field="code" :cell="props" />
        <Cell field="name" :cell="props" />
        <CellProviders :cell="props" />
        <Cell field="field" :cell="props" />
        <Cell field="oldValue" :cell="props" />
        <Cell field="newValue" :cell="props" />
        <Cell field="createdAt" format="datetime" :cell="props" />
      </template>
    </TableQueryLazy>
  </q-page>
</template>
