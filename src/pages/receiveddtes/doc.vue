<script setup>
import { reactive, provide, onMounted, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useReceivedDtes } from 'stores/receiveddtes'
import { useProducts } from 'stores/products'
import { useSupplies } from 'stores/supplies'
import ItemDte from './components/ItemDte.vue'

const receivedDtes = useReceivedDtes()
provide(receivedDtes.$id, receivedDtes)
const products = useProducts()
provide(products.$id, products)
const supplies = useSupplies()
provide(supplies.$id, supplies)
const loading = ref(false)

const $route = useRoute()
const id = $route.params.id

const receivedDte = reactive({})

onMounted(async () => {
  await receivedDtes.getDoc(id)
  Object.assign(receivedDte, receivedDtes.doc)
})

const receiveDte = async () => {
  loading.value = true
  await receivedDtes.replace(receivedDte._id, receivedDte)
  console.log(receivedDtes.doc)
  Object.assign(receivedDte, receivedDtes.doc)
  loading.value = false
}
</script>

<template>
  <LayoutPage :loading="receivedDtes.loading" class="q-pa-md">
    <q-card flat bordered class="q-mb-sm q-pt-md" style="border-color: grey">
      <q-card-section class="row justify-between">
        <div class="row q-gutter-x-sm">
          <InputRead
            label="Tipo DTE"
            :modelValue="receivedDte.dteTypeName"
            input-class="text-bold"
            width="200"
          />
          <InputRead
            label="Folio"
            :modelValue="receivedDte.number"
            input-class="text-bold"
          />
          <InputRead
            v-if="receivedDte.providerAlias"
            label="Proveedor"
            :modelValue="receivedDte.providerAlias"
            input-class="text-bold"
            width="250"
          >
            <q-tooltip>{{ receivedDte.providerName }}</q-tooltip>
          </InputRead>
          <InputRead
            label="Fecha Emisión"
            :modelValue="receivedDte.emissionDate"
            format="localDate"
            input-class="text-bold"
          />
        </div>

        <div class="row q-gutter-x-sm">
          <InputRead
            v-if="receivedDte.receptionDate"
            label="Recibido"
            :modelValue="receivedDte.receptionDate"
            format="datetime"
            input-class="text-bold"
            width="220"
          >
            <template v-slot:append>
              <q-icon name="check_circle" color="positive" size="sm" />
            </template>
          </InputRead>

          <q-btn
            v-else
            label="Recibir Stock"
            icon="library_add_check"
            color="positive"
            style="height: 54px"
            @click="receiveDte"
            :loading="loading"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-list
      bordered
      separator
      class="rounded-borders"
      style="border-color: grey"
    >
      <ItemDte
        v-for="item of receivedDte.items"
        :key="item.line"
        :item="item"
      />
    </q-list>

    <q-card flat bordered class="q-mt-sm q-pt-md" style="border-color: grey">
      <q-card-section class="full-width row justify-end">
        <div class="row q-gutter-x-sm">
          <InputRead
            v-if="receivedDte.paymentMethod"
            label="Tipo de Pago"
            :modelValue="receivedDte.paymentMethod"
            input-class="text-bold"
          />
          <InputRead
            v-if="receivedDte.expirationDate"
            label="Expiración de Pago"
            :modelValue="receivedDte.expirationDate"
            format="localDate"
            input-class="text-bold"
          />
          <InputRead
            label="TOTAL NETO"
            :modelValue="receivedDte.netAmount"
            format="currency"
            input-class="text-bold"
          />
          <InputRead
            label="TOTAL ILA"
            input-class="text-bold"
            v-for="tax of receivedDte.taxes"
            :key="tax.code"
            :modelValue="tax.amount"
            format="currency"
            :hint="`(Cod ${tax.code}) ${tax.rate}%`"
          />
          <InputRead
            v-if="receivedDte.exemptAmount > 0"
            label="Total Excento"
            :modelValue="receivedDte.exemptAmount"
            format="currency"
            input-class="text-bold"
          />
          <InputRead
            label="TOTAL IVA"
            :modelValue="receivedDte.ivaAmount"
            format="currency"
            input-class="text-bold"
          />
          <InputRead
            label="TOTAL"
            :modelValue="receivedDte.totalAmount"
            format="currency"
            input-class="text-bold"
          />
        </div>
      </q-card-section>
    </q-card>
  </LayoutPage>
</template>
