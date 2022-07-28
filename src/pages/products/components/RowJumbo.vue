<script setup>
import { computed, ref, inject } from 'vue'
import { axios } from 'boot/axios'

const props = defineProps(['product'])

// const products = inject(props.storeId)
let loading = ref(false)

const calcDiff = computed(() => {
  if (props.product.jumboPrice === 0) return 0
  return Math.round((props.product.jumboPrice / props.product.price - 1) * 100)
})

const calcMarginRate = computed(() => {
  if (props.product.jumboPrice === 0) return 0
  return Math.round((props.product.jumboPrice / props.product.cost - 1) * 100)
})

const getPrice = async () => {
  loading.value = true
  const response = await axios.get(
    `https://www.jumbo.cl/${props.product.jumboSlug}/p`
  )

  const data = response.data

  const start = data.search('product:price:amount') + 31
  const end = data.search('product:availability') - 20
  props.product.jumboPrice = parseInt(data.slice(start, end))
  loading.value = false
}

const clear = () => {
  props.product.jumboSlug = ''
  props.product.jumboPrice = 0
}
</script>

<template>
  <RowMultiCols>
    <div class="row col">
      <Input
        v-model="product.jumboSlug"
        label="Nombre producto en URL de Jumbo"
        class="col"
      />
      <div class="q-pt-sm">
        <q-btn
          icon="refresh"
          @click="getPrice"
          :loading="loading"
          class="text-primary q-ml-sm"
        />
        <q-btn icon="clear" @click="clear" class="text-grey-8 q-ml-sm" />
      </div>
    </div>
    <RowMultiCols>
      <Input
        label="Precio en Jumbo"
        v-model="product.jumboPrice"
        format="currency"
        class="col"
        readonly
      />
      <Input
        label="Diferencia"
        v-model="calcDiff"
        format="percent"
        class="col"
        :high="50"
        :low="0"
        readonly
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
    </RowMultiCols>
  </RowMultiCols>
</template>
