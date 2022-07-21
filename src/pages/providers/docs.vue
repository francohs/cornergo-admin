<template>
  <LayoutPage>
    <TableQueryLazy
      tableName="providersTable"
      :storeId="providers.$id"
      :columns="columns"
      title="Proveedores"
      titleIcon="local_shipping"
      inputPlaceholder="Buscar proveedor..."
      noDataText="Puedes filtrar proveedores por nombre o rut"
      withInput
      initFetch
      activeToggle
      createBtn
    >
      <template v-slot="{ props }">
        <CellLink field="_id" :name="providers.$id" :cell="props" />
        <CellInput field="alias" :storeId="providers.$id" :cell="props" />
        <CellInput field="name" :storeId="providers.$id" :cell="props" />
        <CellInput
          field="rut"
          format="rut"
          :storeId="providers.$id"
          :cell="props"
        />
        <CellToggle
          field="shippingCosts"
          :storeId="providers.$id"
          :cell="props"
        />
        <CellToggle field="active" :storeId="providers.$id" :cell="props" />
      </template>
    </TableQueryLazy>
  </LayoutPage>
</template>

<script>
import { useProviders } from 'stores/providers'
import { provide } from 'vue'

export default {
  name: 'ProvidersDocs',
  setup() {
    const providers = useProviders()
    provide(providers.$id, providers)

    return {
      providers,
      columns: [
        { label: 'DETALLE', name: '_id', size: 50 },
        { label: 'ALIAS', name: 'alias', align: 'left' },
        { label: 'NOMBRE', name: 'name', align: 'left' },
        { label: 'RUT', name: 'rut' },
        { label: 'COSTOS ENVIO', name: 'shippingCosts' },
        { label: 'ACTIVO', name: 'active' }
      ]
    }
  }
}
</script>
