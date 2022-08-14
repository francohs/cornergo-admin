<script setup>
import { computed, inject, ref, reactive } from 'vue'
import formatter from 'tools/formatter'
const props = defineProps(['product'])
const { product } = props
const { supply } = product
supply.units = computed(() => {
  if (!supply) return 0
  return supply.packageQuantity * supply.orderQuantity
})
supply.subtotal = computed(() => {
  if (!supply) return 0
  return supply.units * supply.cost
})
</script>

<template>
  <q-item v-bind="$attrs" style="border-color: grey" class="bg-white">
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
          <!-- <Input
            label="Mínimo"
            v-model="product.minimum"
            storeId="products"
            :id="product._id"
            field="minimum"
            width="90"
            dense
          /> -->
          <Input
            label="Vitrína"
            v-model="product.showcase"
            storeId="products"
            :id="product._id"
            field="showcase"
            width="90"
            dense
          />
          <InputRead
            label="Venta Sem"
            :modelValue="product.weekSale"
            width="90"
            dense
          />
          <InputRead
            label="Venta Prom"
            :modelValue="product.weekSaleAvg"
            width="90"
            dense
          />
          <InputRead
            label="Margen Prom"
            :modelValue="product.marginAvg"
            width="90"
            format="currency"
            dense
          />
          <div class="column items-center text-grey-7" style="font-size: 12px">
            Activo
            <Toggle
              storeId="products"
              :id="product._id"
              field="active"
              v-model="product.active"
              size="sm"
              dense
            />
          </div>

          <!-- <div>
            <q-btn label="ALTERNATIVAS" rounded size="sm" />
          </div> -->
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
          <Input
            label="Unidad"
            v-model="supply.unit"
            storeId="supplies"
            :id="supply._id"
            field="unit"
            width="120"
            dense
            bold
          />
          <Input
            label="Cnt x Pack"
            v-model="supply.packageQuantity"
            storeId="supplies"
            :id="supply._id"
            field="packageQuantity"
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
