<template>
  <q-page>
    <TableQueryLazy
      tableName="suppliesTable"
      :storeId="supplies.$id"
      :columns="columns"
      title="Suministros"
      titleIcon="inventory"
      inputPlaceholder="Buscar suministro..."
      noDataText="Puedes filtrar suministros codigo de producto o nombre"
      ref="tableRef"
      activeToggle
    >
      <template v-slot:extracontrols>
        <SelectInputFetch
          lazy
          fetchAll
          :storeId="providers.$id"
          v-model="supplies.suppliesTable.equalFilter.providerAlias"
          field="alias"
          label="Proveedor"
          icon="local_shipping"
          style="width: 240px"
        />
        <q-space />
        <!-- <ButtonLinkCreate /> -->
      </template>

      <template v-slot="{ props }">
        <Cell field="providerAlias" :cell="props" />
        <Cell field="sku" :cell="props" />
        <CellInput field="unitCode" :storeId="supplies.$id" :cell="props" />
        <Cell field="name" :cell="props" />
        <Cell field="unit" :cell="props" />
        <CellInput field="multipler" :storeId="supplies.$id" :cell="props" />
        <CellInput
          field="packageQuantity"
          :storeId="supplies.$id"
          :cell="props"
        />
        <Cell format="currency" field="shippingCost" :cell="props" />
        <Cell format="currency" field="unitShipping" :cell="props" />
        <Cell field="taxCode" :cell="props" />
        <Cell field="exempt" format="boolean" :cell="props" />
        <Cell field="cost" format="currency" :cell="props" />
        <CellInput
          field="unitCost"
          format="currency"
          :storeId="supplies.$id"
          :cell="props"
        />
        <Cell field="createdAt" format="date" :cell="props" />
        <Cell field="updatedAt" format="date" :cell="props" />
        <CellToggle field="active" :storeId="supplies.$id" :cell="props" />
      </template>
    </TableQueryLazy>
  </q-page>
</template>

<script>
import { useSupplies } from 'stores/supplies'
import { useProviders } from 'stores/providers'
import { provide, ref } from 'vue'

export default {
  setup() {
    const supplies = useSupplies()
    const providers = useProviders()
    const tableRef = ref({})
    provide(supplies.$id, supplies)
    provide(providers.$id, providers)

    return {
      supplies,
      providers,
      tableRef,
      columns: [
        // { label: 'DETALLE', name: '_id', size: 50 },
        { label: 'PROVEEDOR', name: 'providerAlias' },
        { label: 'SKU', name: 'sku' },
        { label: 'CÓDIGO UND', name: 'unitCode' },
        { label: 'NOMBRE', name: 'name', align: 'left' },
        { label: 'MEDIDA', name: 'unit' },
        { label: 'MULTI', name: 'multipler' },
        { label: 'UNIDADES', name: 'packageQuantity' },
        { label: 'FLETE', name: 'shippingCost' },
        { label: 'FLETE UND', name: 'unitShipping' },
        { label: 'ILA', name: 'taxCode' },
        { label: 'EXENTO', name: 'exempt' },
        { label: 'COSTO', name: 'cost' },
        { label: 'COSTO UND', name: 'unitCost' },
        { label: 'CREADO', name: 'createdAt' },
        { label: 'ACTUALIZADO', name: 'updatedAt' },
        { label: 'ACTIVO', name: 'active', size: 50 }
      ]
    }
  },

  name: 'ProductsDocs'
}
</script>
