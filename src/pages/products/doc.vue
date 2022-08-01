<script setup>
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'
import { useSupplies } from 'stores/supplies'
import { onMounted, provide, reactive, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import formatter from 'tools/formatter'
import RowJumbo from './components/RowJumbo.vue'
import ItemPack from './components/ItemPack.vue'
import ChartSales from './components/ChartSales.vue'

const products = useProducts()
const providers = useProviders()
const supplies = useSupplies()
const $route = useRoute()
const id = $route.params.id
const product = reactive({})
const isPack = ref(false)
const chart = ref(null)

provide(products.$id, products)
provide(providers.$id, providers)
provide(supplies.$id, supplies)

onMounted(async () => {
  supplies.clearDocs()
  await products.getDoc(id)
  Object.assign(product, products.doc)

  if (product.pack && product.pack.length) isPack.value = true

  await supplies.getQueryDocs({ query: { equal: { product: id } } })

  chart.value.create(product.weekSales)
})

const calcPrice = computed(() =>
  Math.round(product.cost * (1 + product.marginRate / 100))
)

const packCost = computed(() => {
  if (product.pack && product.pack.length) {
    return product.pack.reduce(
      (acc, curr) => acc + curr.product.cost * curr.quantity,
      0
    )
  }
  return 0
})

const calcMarginRate = computed(() =>
  Math.round((product.price / product.cost - 1) * 100)
)

const addItemPack = newProduct => {
  product.pack.push({
    product: newProduct,
    quantity: 1
  })
}

const removeItemPack = id => {
  product.pack = product.pack.filter(i => i.product._id != id)
}
</script>

<template>
  <PageResponsive :loading="product.loading" :maxWidth="1200">
    <FormSave :storeId="products.$id" :id="id" :doc="product">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h6">{{ product.name }}</div>
        </div>
        <RowTimestamps v-if="product._id" :doc="product" />
      </div>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          GENERAL
        </div>
        <div>
          <Toggle v-model="isPack" label="Pack" />
          <Toggle
            v-model="product.active"
            label="Activo"
            storeId="products"
            :id="product._id"
            field="active"
            class="q-ml-md"
          />
        </div>
      </div>

      <RowMultiCols>
        <Input
          label="Nombre"
          v-model="product.name"
          storeId="products"
          :id="product._id"
          field="name"
          class="col"
        />
        <div class="col-4">
          <Input label="Código" v-model="product.code" class="full-width" />
        </div>
      </RowMultiCols>

      <div v-if="isPack" class="text-subtitle2 q-mb-md q-pl-sm">
        PRODUCTOS DEL PACK
      </div>

      <div v-if="isPack">
        <ItemPack
          v-for="item of product.pack"
          :key="item.product._id"
          :item="item"
          @remove="removeItemPack"
        />
        <SelectSearchProduct
          label="Agregar producto al pack"
          @chose="addItemPack"
          class="q-my-md full-width"
        />
      </div>

      <div class="text-subtitle2 q-my-md q-pl-sm">INVENTARIO</div>

      <RowMultiCols>
        <Input
          v-model="product.stock"
          storeId="products"
          :id="product._id"
          field="stock"
          label="Stock"
          class="col"
        />
        <Input
          label="Vitrina"
          v-model="product.showcase"
          storeId="products"
          :id="product._id"
          field="showcase"
          tooltip="Cantidad exhibida"
          class="col"
        />
        <!-- <Input
          label="Mínimo"
          v-model="product.minimum"
          tooltip="Cantidad mínima en tienda"
          class="col"
        /> -->
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">SUMINISTROS</div>

      <Table
        :rows="supplies.docs"
        :columns="[
          { label: 'PROVEEDOR', name: 'providerAlias', align: 'left' },
          { label: 'NOMBRE', name: 'name', align: 'left' },
          { label: 'MEDIDA', name: 'unit' },
          { label: 'UNIDADES', name: 'packageQuantity' },
          { label: 'COSTO', name: 'cost' },
          { label: 'MARGEN', name: 'pmargin' },
          { label: 'RECIBIDO', name: 'lastReceived.updatedAt' },
          { label: 'ACTIVO', name: 'active', size: 50 }
        ]"
        :loading="supplies.loading"
        hide-bottom
        flat
        bordered
        class="q-mb-lg"
      >
        <template v-slot="{ props }">
          <Cell field="providerAlias" :cell="props" />
          <Cell field="name" :cell="props" />
          <Cell field="unit" :cell="props" />
          <Cell field="packageQuantity" :cell="props" />
          <Cell field="cost" format="currency" :cell="props" />
          <Cell field="pmargin" :cell="props" v-if="product.price"
            ><ValuePercent
              :value="product.price"
              :total="product.cost"
              :high="40"
              :low="30"
          /></Cell>
          <Cell
            field="lastReceived.updatedAt"
            format="localDate"
            :cell="props"
          />
          <CellToggle field="active" :storeId="supplies.$id" :cell="props" />
        </template>
      </Table>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          PRECIO
        </div>
        <Toggle label="Exento" v-model="product.exempt" />
      </div>

      <RowMultiCols>
        <Input
          v-model="product.cost"
          label="Costo"
          format="currency"
          storeId="products"
          :id="product._id"
          field="cost"
          :hint="packCost ? `Costo Pack: ${formatter.currency(packCost)}` : ''"
          class="col"
        />
        <Input
          label="Margen Esperado"
          v-model="product.marginRate"
          format="percent"
          class="col"
        />
        <Input
          :label="`Precio ($ ${calcPrice})`"
          v-model="product.price"
          storeId="products"
          :id="product._id"
          field="price"
          format="currency"
          class="col"
        />
        <Input
          label="Margen"
          v-model="calcMarginRate"
          format="percent"
          class="col"
          :high="40"
          :low="30"
          readonly
        />
        <Input
          label="Precio BAT"
          v-model="product.batPrice"
          format="currency"
          class="col"
          v-if="product.exempt"
        />
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">JUMBO</div>

      <RowJumbo :product="product" />

      <div class="text-subtitle2 q-my-md q-pl-sm">VENTAS</div>

      <RowMultiCols>
        <InputRead
          label="Última Venta"
          :modelValue="formatter.localDate(product.lastSale)"
          class="col"
        />
        <InputRead
          label="Venta Semanal Prom"
          :modelValue="product.weekSaleAvg"
          class="col"
        />
        <InputRead
          label="Margen Semanal Prom"
          :modelValue="product.weekMarginAvg"
          class="col"
          format="currency"
        />
        <InputRead
          label="Total Ventas"
          :modelValue="product.totalSales"
          class="col"
        />
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">VENTAS SEMANALES</div>

      <ChartSales ref="chart" />

      <div class="row justify-between q-mt-lg">
        <ButtonDelete :storeId="products.$id" :id="id" />

        <div>
          <q-btn
            label="GUARDAR"
            color="positive"
            type="submit"
            :loading="products.saving"
          />
        </div>
      </div>
    </FormSave>
  </PageResponsive>
</template>
