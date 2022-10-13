<script setup>
import { useAuth } from 'stores/auth'
const auth = useAuth()
</script>

<template>
  <q-drawer v-bind="$attrs" bordered content-class="bg-grey-1" :width="220">
    <q-list bordered padding class="text-grey-9">
      <ItemLink page="receiveddtes" icon="file_copy" label="DTEs Recibidos" />
      <ItemLink page="emitteddtes" icon="receipt_long" label="DTEs Emitidos" />
      <ItemLink page="sales" icon="bar_chart" label="Ventas" />
      <ItemLink page="orders" icon="local_shipping" label="Pedidos" />
      <ItemLink page="supplies" icon="widgets" label="Suministros" />
      <ItemLink page="products" icon="inventory" label="Productos" />
      <ItemLink
        page="productssales"
        icon="change_circle"
        label="Rotacion"
        v-if="auth.user.isAdmin"
      />
      <ItemLink page="inventory" icon="fact_check" label="Inventario" />
      <ItemLink page="labels" icon="sell" label="Etiquetas" />
      <ItemLink
        page="productsupdates"
        icon="edit_note"
        label="Cambios"
        v-if="auth.user.isAdmin"
      />
      <ItemLink page="providers" icon="support_agent" label="Proveedores" />
      <ItemLink
        page="clients"
        icon="groups"
        label="Clientes"
        v-if="auth.user.isAdmin"
      />
      <ItemLink
        page="company"
        icon="business"
        label="Empresa"
        v-if="auth.user.isAdmin"
      />
      <ItemLink
        page="cashmoves"
        icon="payments"
        label="Arqueos"
        v-if="auth.user.isAdmin"
      />
      <ItemLink
        page="users"
        icon="people"
        label="Usuarios"
        v-if="auth.user.isAdmin"
      />
      <!-- <ItemLink page="chart" icon="equalizer" label="Chart" /> -->
    </q-list>
  </q-drawer>
</template>
