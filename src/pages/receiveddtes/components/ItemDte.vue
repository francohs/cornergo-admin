<script setup>
import { computed, inject, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import formatter from 'tools/formatter'
import SelectInputFetch from 'src/components/Select/SelectInputFetch.vue'

const props = defineProps(['item'])

const router = useRouter()
const receivedDtes = inject('receiveddtes')
const supplies = inject('supplies')
const products = inject('products')

const supply = reactive(props.item.supply || {})
const product = reactive(supply.product || {})
const loading = ref(false)
const emptyCode = ref('')

supply.units = computed(() => {
  return supply.multipler * props.item.quantity
})

const netAmount = computed(() => {
  const discount = props.item.discountAmount ? props.item.discountAmount : 0
  return Math.round(props.item.netAmount * props.item.quantity - discount)
})

const unitNetAmount = computed(() => {
  return Math.round(netAmount.value / supply.units)
})

const taxAmount = computed(() => {
  return Math.round(netAmount.value * (props.item.taxRate / 100))
})

const unitTaxAmount = computed(() => {
  return Math.round(taxAmount.value / supply.units)
})

const unitIvaAmount = computed(() => {
  return Math.round(unitNetAmount.value * 0.19)
})

product.calcPrice = computed(() => {
  let cost = supply.autoCost ? supply.calcCost : supply.cost
  let price = Math.round(cost * (1 + product.marginRate / 100))
  let lastTwo = price.toString().slice(-2)
  const lastTwoNum = parseInt(lastTwo)

  if (lastTwoNum > 0 && lastTwoNum <= 50) {
    lastTwo = 50
  } else if (lastTwoNum > 50) {
    lastTwo = 90
  }
  let priceArray = price.toString().split('')
  priceArray.splice(-2, 2, lastTwo.toString()[0], lastTwo.toString()[1])
  return Math.round(priceArray.join(''))
})

product.calcMargin = computed(() => {
  let price = product.autoPrice ? product.calcPrice : product.price
  let cost = supply.autoCost ? supply.calcCost : supply.cost

  return Math.round((price / cost - 1) * 100)
})

supply.calcShippingCost = computed(() => {
  const calcCostWithoutShipping =
    Math.round(unitNetAmount.value * 1.19) + unitTaxAmount.value

  let cost = supply.autoCost ? supply.calcCost : supply.cost
  return Math.round((supply.units * (cost - calcCostWithoutShipping)) / 1.19)
})

const unitShippingCost = computed(() => {
  if (
    !supply.autoCost &&
    receivedDtes.doc.provider &&
    receivedDtes.doc.provider.shippingCosts
  ) {
    return Math.round(supply.calcShippingCost / supply.units)
  } else {
    return Math.round(supply.shippingCost / supply.units)
  }
})

product.calcStock = computed(() => {
  let stock = Number.isInteger(parseFloat(product.stock))
    ? parseInt(product.stock)
    : parseFloat(parseFloat(product.stock).toFixed(2))

  stock +=
    receivedDtes.doc.dteTypeName == 'Nota de Credito'
      ? -supply.units
      : supply.units
  return stock
})

supply.calcCost = computed(() => {
  return Math.round(
    (unitNetAmount.value + unitShippingCost.value) * 1.19 + unitTaxAmount.value
  )
})

const unitDiscountAmount = computed(() => {
  if (props.item.discountAmount) {
    return Math.round(props.item.discountAmount / supply.units)
  } else {
    return 0
  }
})

const matchProduct = async selectedProduct => {
  loading.value = true

  await products.getDoc(selectedProduct._id)
  Object.assign(product, products.doc)

  await supplies.update(supply._id, {
    product: product._id,
    productCode: product.code
  })

  props.item.supply.product = product
  props.item.supply.cost = product.cost

  loading.value = false
}

const removeMatch = async () => {
  loading.value = true

  await supplies.update(supply._id, {
    product: null,
    productCode: null
  })

  Object.assign(product, { _id: null })
  props.item.supply.product = null

  loading.value = false
}

const createProduct = () => {
  products.doc = {
    name: props.item.name,
    code: product.code,
    providers: [supply.providerAlias]
  }
  router.push({ name: 'products/create' })
}
</script>

<template>
  <q-item class="q-pb-none q-pt-md bg-white" style="border-color: grey">
    <div class="full-width row q-gutter-y-sm">
      <div class="full-width row justify-between">
        <div class="row q-gutter-x-sm">
          <InputRead
            label="Línea"
            :modelValue="item.line"
            bold
            width="50"
            dense
          />
          <InputRead
            label="SKU"
            :modelValue="item.sku"
            width="180"
            dense
            bold
          />
          <InputRead
            label="Nombre Suministro"
            :modelValue="item.name"
            :hint="`Creado ${formatter.localDate(supply.createdAt)}`"
            input-style="font-size: 14px;"
            width="400"
            dense
            bold
          />
          <InputRead
            label="Cantidad"
            :modelValue="item.quantity"
            :hint="item.unit"
            width="70"
            dense
            bold
          />
          <Input
            label="Multiplicador"
            v-model="supply.multipler"
            storeId="supplies"
            :id="supply._id"
            field="multipler"
            width="90"
            dense
          />
          <InputRead
            dense
            label="Unidades"
            width="70"
            :modelValue="supply.units"
          />
          <InputAuto
            label="Unds x Pack"
            v-model="supply.packageQuantity"
            v-model:isAuto="supply.autoPackageQty"
            :autoValue="supply.multipler"
            storeId="supplies"
            :id="supply._id"
            autoField="autoPackageQty"
            field="packageQuantity"
            width="120"
            dense
          />
        </div>

        <div class="row q-gutter-x-sm">
          <InputRead
            dense
            label="Neto Bruto"
            :modelValue="item.netAmount"
            format="currency"
            width="100"
          />
          <InputRead
            label="Descuento"
            width="90"
            :modelValue="item.discountAmount"
            format="currency"
            :hint="formatter.percent(item.discountRate)"
            v-if="item.discountAmount > 0"
            dense
          />
          <InputRead
            dense
            label="ILA"
            width="100"
            :modelValue="taxAmount"
            format="currency"
            :hint="item.taxCode ? `(Cod ${item.taxCode}) ${item.taxRate}%` : ''"
            v-if="item.taxCode"
          />
          <InputAuto
            label="Flete"
            storeId="supplies"
            field="shippingCost"
            :id="supply._id"
            v-model="supply.shippingCost"
            :isAuto="!supply.autoCost"
            :autoValue="supply.calcShippingCost"
            :hintAuto="`Calculado ${formatter.currency(
              supply.calcShippingCost
            )}`"
            :hintManual="`Manual ${formatter.currency(supply.shippingCost)}`"
            width="120"
            format="currency"
            v-if="
              receivedDtes.doc.provider &&
              receivedDtes.doc.provider.shippingCosts
            "
            dense
          />
          <InputRead
            dense
            label="Subtotal"
            :modelValue="item.subtotal"
            format="currency"
            width="100"
          />
        </div>
      </div>

      <!-- ---------------------------- -->

      <div class="full-width row justify-between" v-if="!product._id">
        <div class="row q-gutter-x-sm">
          <!-- <InputRead
            dense
            label="Línea"
            :modelValue="item.line"
            style="opacity: 0"
            width="50"
          /> -->
          <div>
            <q-btn
              label="CREAR PRODUCTO"
              @click="createProduct"
              color="positive"
              size="md"
            />
          </div>
          <div class="q-px-md q-pt-sm">O asignar</div>
          <SelectSearchProduct
            label="Código o Nombre"
            v-model="emptyCode"
            @chose="matchProduct"
            :loading="loading"
            width="350"
            hint=""
            dense
          />
        </div>
      </div>

      <!-- ---------------------------- -->

      <div class="full-width row justify-between" v-if="product._id">
        <div class="row q-gutter-x-sm">
          <!-- <InputRead
            dense
            label="Línea"
            :modelValue="item.line"
            style="opacity: 0"
            width="50"
          /> -->
          <div style="width: 50px; padding-top: 5px" class="q-pl-sm">
            <q-btn
              dense
              round
              flat
              icon="clear"
              color="grey-7"
              @click="removeMatch(product._id)"
              :loading="loading"
            />
          </div>

          <InputRead
            dense
            label="Código"
            :modelValue="product.code"
            width="180"
          />
          <Input
            label="Nombre Producto"
            v-model="product.name"
            storeId="products"
            :id="product._id"
            field="name"
            :hint="`Creado ${formatter.localDate(product.createdAt)}`"
            input-style="font-size: 14px;"
            width="400"
            dense
          />
          <InputAuto
            v-if="!receivedDtes.doc.receptionDate"
            label="Nuevo Stock"
            v-model="product.stock"
            :isAuto="product.autoStock"
            @update:isAuto="product.autoStock = $event"
            autoField="autoStock"
            :autoValue="product.calcStock"
            :hintManual="`Antes ${
              item.supply.product && item.supply.product.stock
            }`"
            storeId="products"
            :id="product._id"
            field="stock"
            width="120"
            dense
          />
          <Input
            v-else
            label="Stock"
            v-model="item.supply.product.stock"
            storeId="products"
            :id="product._id"
            field="stock"
            width="100"
            dense
          />
          <InputRead
            label="Pedido"
            v-if="supply.lastOrdered"
            :modelValue="supply.lastOrdered.quantity"
            :hint="formatter.localDate(supply.lastOrdered.updatedAt)"
            width="90"
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
        </div>

        <div class="row q-gutter-x-sm">
          <InputRead
            label="ILA Und"
            :modelValue="unitTaxAmount"
            :hint="item.taxCode ? `(Cod ${item.taxCode}) ${item.taxRate}%` : ''"
            format="currency"
            width="100"
            v-if="item.taxCode"
            dense
          />
          <InputRead
            label="Flete Und"
            :modelValue="unitShippingCost"
            format="currency"
            width="100"
            v-if="
              receivedDtes.doc.provider &&
              receivedDtes.doc.provider.shippingCosts
            "
            dense
          />
          <InputAuto
            label="Costo"
            v-model="supply.cost"
            v-model:isAuto="supply.autoCost"
            autoField="autoCost"
            :autoValue="supply.calcCost"
            storeId="supplies"
            :id="supply._id"
            field="cost"
            :hintManual="`Manual ${formatter.currency(supply.cost)}`"
            :hintAuto="`Calculado ${formatter.currency(supply.calcCost)}`"
            format="currency"
            width="120"
            dense
          />
          <InputAuto
            label="Precio"
            v-model="product.price"
            v-model:isAuto="product.autoPrice"
            autoField="autoPrice"
            :autoValue="product.calcPrice"
            :hintAuto="`Calculado ${formatter.currency(product.calcPrice)}`"
            storeId="products"
            :id="product._id"
            format="currency"
            width="120"
            dense
          />
          <InputAuto
            label="Margen"
            v-model="product.marginRate"
            :isAuto="!product.autoPrice"
            :autoValue="product.calcMargin"
            :low="30"
            :high="40"
            format="percent"
            width="100"
            dense
          />
        </div>
      </div>
    </div>
  </q-item>
</template>
