<template>
  <div class="full-width row q-gutter-y-sm q-py-sm">
    <div class="full-width row justify-between" v-if="product._id">
      <div class="row q-gutter-x-sm">
        <InputRead
          label="Código"
          :modelValue="product.code"
          width="180"
          dense
        />
        <InputRead
          label="Nombre Producto"
          :modelValue="product.name"
          :hint="`Creado ${formatter.date(product.createdAt)}`"
          input-style="font-size: 14px;"
          width="400"
          dense
        />
        <Input
          label="Stock"
          v-model="product.stock"
          storeId="products"
          :id="product._id"
          field="stock"
          width="90"
          dense
        />
        <Input
          label="Mínimo"
          :modelValue="product.minimum"
          storeId="products"
          :id="product._id"
          field="minimum"
          width="90"
          dense
        />
        <InputRead label="Venta" :modelValue="product.sale" width="90" dense />
        <InputRead
          label="Venta Prom"
          :modelValue="product.saleAvg"
          width="90"
          dense
        />
        <InputRead
          label="Costo Producto"
          :modelValue="supply.cost"
          width="100"
          format="currency"
          dense
        />
        <div>
          <q-btn label="ALTERNATIVAS" rounded size="sm" />
        </div>
      </div>
    </div>

    <div class="full-width row justify-between" v-if="supply">
      <div class="row q-gutter-x-sm">
        <InputRead label="SKU" :modelValue="supply.sku" width="180" dense />
        <InputRead
          label="Nombre Suministro"
          :modelValue="supply.name"
          :hint="`Creado ${formatter.date(supply.createdAt)}`"
          input-style="font-size: 14px;"
          width="400"
          dense
        />
        <InputRead
          label="Pedido"
          :modelValue="supply.orderQuantity"
          width="90"
          dense
        />
        <InputRead label="Unidad" :modelValue="supply.unit" width="120" dense />
        <InputRead
          label="Multiplicador"
          :modelValue="supply.multipler"
          storeId="supplies"
          :id="supply._id"
          field="multipler"
          width="90"
          dense
        />
        <InputRead
          label="Unidades"
          :modelValue="supply.units"
          width="90"
          dense
        />
        <InputRead
          label="Costo Suministro"
          :modelValue="5000"
          width="120"
          format="currency"
          dense
        />
        <InputRead
          label="Subtotal"
          :modelValue="25000"
          width="120"
          format="currency"
          dense
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, reactive } from 'vue'
import formatter from 'tools/formatter'
const props = defineProps(['product'])
const { product } = props
const { supply } = product
supply.units = computed(() => {
  return supply.multipler * supply.orderQuantity
})
</script>
