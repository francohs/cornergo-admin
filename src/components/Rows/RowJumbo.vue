<template>
  <RowMultiCols>
    <Input
      v-model="products.doc.jumboSlug"
      label="Nombre producto en URL de Jumbo"
    />
    <div class="q-pt-lg col-shrink">
      <q-btn
        icon="refresh"
        @click="getPrice"
        :loading="loading"
        class="text-primary"
      />
      <q-btn icon="clear" @click="clear" class="text-grey-8 q-ml-sm" />
    </div>
    <Input
      label="Precio en Jumbo"
      v-model="products.doc.jumboPrice"
      format="currency"
      class="col-shrink"
      readonly
    />
    <Input
      label="Diferencia"
      v-model="calcDiff"
      format="percent"
      class="col-shrink"
      :high="50"
      :low="0"
      readonly
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
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { axios } from 'boot/axios'

const props = defineProps(['storeId'])

const products = inject(props.storeId)
let loading = ref(false)

const calcDiff = computed(() => {
  if (products.doc.jumboPrice === 0) return 0
  return Math.round((products.doc.jumboPrice / products.doc.price - 1) * 100)
})

const calcMarginRate = computed(() => {
  if (products.doc.jumboPrice === 0) return 0
  return Math.round((products.doc.jumboPrice / products.doc.cost - 1) * 100)
})

const getPrice = async () => {
  loading.value = true
  const response = await axios.get(
    `https://www.jumbo.cl/${products.doc.jumboSlug}/p`
  )

  const data = response.data

  const start = data.search('product:price:amount') + 31
  const end = data.search('product:availability') - 20
  products.doc.jumboPrice = parseInt(data.slice(start, end))
  loading.value = false
}

const clear = () => {
  products.doc.jumboSlug = ''
  products.doc.jumboPrice = 0
}
</script>
