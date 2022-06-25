<template>
  <q-drawer v-bind="$attrs" bordered content-class="bg-grey-1" :width="220">
    <q-list bordered padding class="text-grey-9">
      <ItemLink page="receiveddtes" icon="file_copy" label="DTEs Recibidos" />
      <ItemLink page="emitteddtes" icon="receipt_long" label="DTEs Emitidos" />
      <ItemLink page="orders" icon="local_shipping" label="Pedidos" />
      <ItemLink page="supplies" icon="widgets" label="Suministros" />
      <ItemLink page="products" icon="inventory" label="Productos" />
      <ItemLink page="inventory" icon="fact_check" label="Inventario" />
      <ItemLink page="providers" icon="support_agent" label="Proveedores" />
      <ItemLink page="clients" icon="groups" label="Clientes" />
      <ItemLink page="company" icon="business" label="Empresa" />
      <ItemLink page="users" icon="people" label="Usuarios" />
      <!-- <ItemLink page="items" icon="checklist" label="Items" /> -->
    </q-list>
  </q-drawer>
</template>
