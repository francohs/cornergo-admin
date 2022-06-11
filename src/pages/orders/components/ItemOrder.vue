<template>
  <q-item v-bind="$attrs" style="border-color: grey">
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
            :hint="`Creado ${formatter.localDate(product.createdAt)}`"
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
          <Input
            label="Vitrína"
            :modelValue="product.showcase"
            storeId="products"
            :id="product._id"
            field="showcase"
            width="90"
            dense
          />
          <InputRead
            label="Venta"
            :modelValue="product.sale"
            width="90"
            dense
          />
          <InputRead
            label="Venta Prom"
            :modelValue="product.saleAvg"
            width="90"
            dense
          />

          <div>
            <q-btn label="ALTERNATIVAS" rounded size="sm" />
          </div>
        </div>
      </div>

      <div class="full-width row justify-between" v-if="supply">
        <div class="row q-gutter-x-sm">
          <InputRead
            label="SKU"
            :modelValue="supply.sku"
            width="180"
            dense
            bold
          />
          <InputRead
            label="Nombre Suministro"
            :modelValue="supply.name"
            :hint="`Creado ${formatter.localDate(supply.createdAt)}`"
            input-style="font-size: 14px;"
            width="400"
            dense
            bold
          />
          <InputRead
            label="Pedido"
            :modelValue="supply.orderQuantity"
            width="90"
            dense
            bold
          />
          <InputRead
            label="Unidad"
            :modelValue="supply.unit"
            width="120"
            dense
            bold
          />
          <Input
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
            label="Costo Producto"
            :modelValue="supply.cost"
            width="100"
            format="currency"
            dense
          />
          <InputRead
            label="Subtotal"
            :modelValue="supply.subtotal"
            width="120"
            format="currency"
            dense
          />
        </div>
      </div>
    </div>
  </q-item>
</template>

<script setup>
import { computed, inject, ref, reactive } from 'vue'
import formatter from 'tools/formatter'
const props = defineProps(['product'])
const { product } = props
const { supply } = product
supply.units = computed(() => {
  if (!supply) return 0
  return supply.multipler * supply.orderQuantity
})
supply.subtotal = computed(() => {
  if (!supply) return 0
  return supply.units * supply.cost
})
</script>
