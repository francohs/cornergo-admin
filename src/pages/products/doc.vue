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
        <Toggle v-model="product.active" label="Activo" />
      </div>

      <RowMultiCols>
        <SelectInputFetch
          v-model="product.name"
          :storeId="products.$id"
          lazy
          label="Nombre"
          field="name"
          :minInput="2"
          class="col-8"
          hint=""
        />
        <Input label="Código" v-model="product.code" class="col-4" />
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">INVENTARIO</div>

      <RowMultiCols>
        <Input v-model="product.stock" label="Stock" />
        <Input
          label="Vitrina"
          v-model="product.showcase"
          tooltip="Cantidad exhibida"
        />
        <Input
          label="Mínimo"
          v-model="product.minimum"
          tooltip="Cantidad mínima en tienda"
          :readonly="product.autoMin"
        >
          <template v-slot:append>
            <q-btn
              flat
              dense
              label="AUTO"
              :color="product.autoMin ? 'primary' : ''"
              @click="product.autoMin = !product.autoMin"
            />
          </template>
        </Input>
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">SUMINISTROS</div>

      <Table
        :rows="supplies.docs"
        :columns="[
          { label: 'PROVEEDOR', name: 'providerAlias', align: 'left' },
          { label: 'NOMBRE', name: 'name', align: 'left' },
          { label: 'MEDIDA', name: 'unit' },
          { label: 'UNIDADES', name: 'packageQuantity' },
          { label: 'COSTO', name: 'unitCost' },
          { label: 'MARGEN', name: 'pmargin' },
          { label: 'RECIBIDO', name: 'updatedAt' },
          { label: 'ACTIVO', name: 'active', size: 50 }
        ]"
        :loading="supplies.loading"
        hide-bottom
        flat
        bordered
        class="q-mb-lg"
      >
        <template v-slot="{ props }">
          <Cell field="providerAlias" :props="props" />
          <Cell field="name" :props="props" />
          <Cell field="unit" :props="props" />
          <Cell field="packageQuantity" :props="props" />
          <Cell field="unitCost" format="currency" :props="props" />
          <Cell field="pmargin" :props="props" v-if="product.price"
            ><ValuePercent
              :value="product.price"
              :total="product.cost"
              :high="40"
              :low="30"
          /></Cell>
          <Cell field="updatedAt" format="date" :props="props" />
          <CellToggle field="active" :storeId="supplies.$id" :props="props" />
        </template>
      </Table>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          PRECIO
        </div>
        <Toggle label="Exento" v-model="product.isExempt" />
      </div>

      <RowMultiCols>
        <Input v-model="product.cost" label="Último Costo" format="currency" />
        <Input
          label="Margen Esperado"
          v-model="product.marginRate"
          format="percent"
          class="col-shrink"
        />
        <Input
          :label="`Precio ($ ${calcPrice})`"
          v-model="product.price"
          format="currency"
        />
        <Input
          label="Margen"
          v-model="calcMarginRate"
          format="percent"
          class="col-shrink"
          :high="40"
          :low="30"
          readonly
        />
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">JUMBO</div>

      <RowJumbo :storeId="products.$id" />

      <div class="text-subtitle2 q-my-md q-pl-sm">VENTAS</div>

      <RowMultiCols>
        <Input
          label="Última Venta"
          :modelValue="formatter.date(product.lastSell)"
          readonly
        />
        <Input label="Total Ventas" :modelValue="product.totalSells" readonly />
      </RowMultiCols>

      <div class="row justify-between q-mt-md">
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

<script setup>
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'
import { useSupplies } from 'stores/supplies'
import { onMounted, provide, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import formatter from 'tools/formatter'
import RowJumbo from './components/RowJumbo.vue'

const products = useProducts()
const providers = useProviders()
const supplies = useSupplies()
const $route = useRoute()
const id = $route.params.id
const product = reactive({})

provide(products.$id, products)
provide(providers.$id, providers)
provide(supplies.$id, supplies)

onMounted(async () => {
  supplies.clearDocs()
  await products.getDoc(id)
  Object.assign(product, products.doc)

  await supplies.getQueryDocs({ query: { equal: { product: id } } })
})

const calcPrice = computed(() =>
  Math.round(product.cost * (1 + product.marginRate / 100))
)

const calcMarginRate = computed(() =>
  Math.round((product.price / product.cost - 1) * 100)
)
</script>
