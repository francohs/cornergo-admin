<script setup>
import { provide, reactive, computed, ref } from 'vue'
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'
import { useRouter } from 'vue-router'
import ItemPack from './components/ItemPack.vue'
import formatter from 'tools/formatter'

const products = useProducts()
const providers = useProviders()
const router = useRouter()

const product = reactive({
  name: products.doc ? products.doc.name : '',
  code: products.doc ? products.doc.code : '',
  pack: [],
  active: true,
  exempt: false,
  marginRate: 40,
  stock: 0,
  showcase: 3,
  cost: 1000,
  price: 1400,
  providers: []
})

const loading = ref(false)
const isPack = ref(false)
const isAutoPrice = ref(true)
const provider = ref(
  products.doc.providers && products.doc.providers.length
    ? products.doc.providers[0]
    : null
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

provide(products.$id, products)
provide(providers.$id, providers)

const autoPrice = computed(() => {
  let autoPrice = Math.round(product.cost * (1 + product.marginRate / 100))
  let lastTwo = autoPrice.toString().slice(-2)
  const lastTwoNum = parseInt(lastTwo)

  if (lastTwoNum > 0 && lastTwoNum <= 50) {
    lastTwo = 50
  } else if (lastTwoNum > 50) {
    lastTwo = 90
  }
  let autoPriceArray = autoPrice.toString().split('')
  autoPriceArray.splice(-2, 2, lastTwo.toString()[0], lastTwo.toString()[1])
  return Math.round(autoPriceArray.join(''))
})

const autoMargin = computed(() => {
  let price = product.autoPrice ? autoPrice.value : product.price

  if (price == 0 || product.cost == 0) return 0

  return Math.round((price / product.cost - 1) * 100)
})

const findProduct = async () => {
  if (product.code != '') {
    loading.value = true
    await products.findDoc({ code: product.code })
    loading.value = false
  }
  return !product.code || !products.doc || 'El código ya existe'
}

const packCost = computed(() => {
  if (product.pack && product.pack.length) {
    return product.pack.reduce((acc, curr) => acc + curr.product.cost, 0)
  }
  return 0
})

const save = async () => {
  if (isAutoPrice.value) {
    product.price = autoPrice.value
  }
  product.providers = [provider.value]
  console.log(product)
  await products.create(product)
  router.go(-1)
}
</script>

<template>
  <PageResponsive :maxWidth="900">
    <Form @submit="save" class="q-pa-lg">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h6">NUEVO PRODUCTO</div>
        </div>
      </div>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          GENERAL
        </div>
        <div>
          <Toggle v-model="isPack" label="Pack" />
          <Toggle v-model="product.active" label="Activo" class="q-ml-md" />
        </div>
      </div>

      <RowMultiCols>
        <SelectInputFetch
          v-model="product.name"
          @input-value="product.name = $event"
          :storeId="products.$id"
          input-debounce="300"
          lazy
          label="Nombre"
          field="name"
          :minInput="2"
          class="col"
          hint=""
          required
        />
        <Input
          label="Código"
          v-model="product.code"
          :anotherRule="findProduct"
          :debounce="500"
          :loading="loading"
          onlynumbers
          style="width: 300px"
          required
        />
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
        <SelectSearchProduct @chose="addItemPack" class="q-my-md full-width" />
      </div>

      <div class="text-subtitle2 q-mb-md q-pl-sm">INVENTARIO</div>

      <RowMultiCols>
        <Input
          label="Vitrina"
          v-model="product.showcase"
          tooltip="Cantidad exhibida"
          onlynumbers
          class="col"
        />
        <SelectProvider v-model="provider" class="col" required />
      </RowMultiCols>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          PRECIO
        </div>

        <Toggle label="Exento (Cigarros)" v-model="product.exempt" />
      </div>

      <RowMultiCols>
        <Input
          label="Costo"
          v-model="product.cost"
          :hint="packCost ? `Costo Pack: ${formatter.currency(packCost)}` : ''"
          format="currency"
          class="col"
        />
        <InputAuto
          label="Precio"
          v-model="product.price"
          v-model:isAuto="isAutoPrice"
          :autoValue="autoPrice"
          :hintAuto="autoPrice ? `Sugerido $ ${autoPrice}` : ''"
          format="currency"
          width="120"
          class="col"
        />
        <InputAuto
          label="Margen"
          v-model="product.marginRate"
          :isAuto="!isAutoPrice"
          :autoValue="autoMargin"
          :low="30"
          :high="40"
          format="percent"
          width="100"
          class="col"
        />
        <Input
          v-if="product.exempt"
          label="Precio Vigente SII"
          v-model="product.batPrice"
          onlynumbers
          class="col"
        />
      </RowMultiCols>

      <div class="row justify-end q-mt-md">
        <div>
          <q-btn
            label="GUARDAR"
            color="positive"
            type="submit"
            :loading="products.saving"
          />
        </div>
      </div>
    </Form>
  </PageResponsive>
</template>
