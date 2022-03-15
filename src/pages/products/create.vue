<template>
  <PageResponsive :loading="product.loading" :maxWidth="900">
    <FormSave :storeId="products.$id" :doc="product">
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
        <Toggle v-model="product.active" label="Activo" />
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
          class="col-8"
          hint=""
        />
        <Input
          label="Código"
          v-model="product.code"
          :anotherRule="findProduct"
          :debounce="500"
          :loading="loading"
          onlynumbers
          class="col"
        />
      </RowMultiCols>

      <div class="text-subtitle2 q-my-md q-pl-sm">INVENTARIO</div>

      <RowMultiCols>
        <Input v-model="product.stock" label="Stock" onlynumbers class="col" />
        <Input
          label="Vitrina"
          v-model="product.showcase"
          tooltip="Cantidad exhibida"
          onlynumbers
          class="col"
        />
        <SelectInputFetch
          label="Proveedor"
          storeId="providers"
          v-model="product.provider"
          lazy
          field="alias"
          icon="local_shipping"
          fetchAll
          style="width: 240px"
          class="col"
        />
      </RowMultiCols>

      <div class="row justify-between q-mb-md">
        <div class="text-subtitle2 q-pl-sm" style="line-height: 35px">
          PRECIO
        </div>
        <Toggle label="Exento" v-model="product.isExempt" />
      </div>

      <RowMultiCols>
        <Input
          v-model="product.cost"
          label="Costo"
          format="currency"
          class="col"
        />
        <InputAuto
          label="Precio"
          v-model="product.price"
          v-model:isAuto="product.autoPrice"
          :autoValue="autoPrice"
          :hintAuto="autoPrice ? `Sugerido $ ${autoPrice}` : ''"
          format="currency"
          width="120"
          class="col"
        />
        <InputAuto
          label="Margen"
          v-model="product.marginRate"
          :isAuto="!product.autoPrice"
          :autoValue="autoMargin"
          :low="30"
          :high="40"
          format="percent"
          width="100"
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
    </FormSave>
  </PageResponsive>
</template>

<script>
import { useProducts } from 'stores/products'
import { useProviders } from 'stores/providers'
import { provide, reactive, computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const products = useProducts()
    const providers = useProviders()
    const $route = useRoute()
    const id = $route.params.id
    const loading = ref(false)
    const product = reactive({
      name: products.doc.name,
      code: products.doc.code,
      active: true,
      isExempt: false,
      autoMin: true,
      marginRate: 40,
      stock: 0,
      showcase: 3,
      cost: 1000,
      price: 1400,
      autoCost: false,
      autoPrice: true,
      provider: products.doc.provider
    })
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

    return {
      id,
      product,
      products,
      providers,
      autoPrice,
      autoMargin,
      loading,
      findProduct
    }
  },

  name: 'ProductCreate'
}
</script>
