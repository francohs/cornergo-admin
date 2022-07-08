<script setup>
import { onMounted, provide, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useEmittedDtes } from 'stores/emitteddtes'
import ItemDte from './components/ItemDte.vue'
import formatter from 'tools/formatter'

const route = useRoute()

const emittedDtes = useEmittedDtes()
const id = route.params.id
const emittedDte = reactive({})

provide(emittedDtes.$id, emittedDtes)

onMounted(async () => {
  try {
    await emittedDtes.getDoc(id)
    Object.assign(emittedDte, emittedDtes.doc)
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <PageResponsive :loading="emittedDtes.loading">
    <div class="q-pa-lg">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <div class="text-h6 text-bold">
            Detalle Boleta: {{ emittedDte.number }}
          </div>
        </div>
        <div class="column items-end">
          <div class="text-h6 text-bold">
            Emisión: {{ formatter.datetime(emittedDte.createdAt) }}
          </div>

          <div>Vendedor: {{ emittedDte.sellerName }}</div>
        </div>
      </div>

      <div class="row col q-mb-lg">
        <q-card class="fit row q-px-md">
          <q-list bordered separator class="fit q-pa-sm">
            <ItemDte
              v-for="item of emittedDte.items"
              :item="item"
              :key="item._id"
            />
          </q-list>
        </q-card>
      </div>

      <div class="q-px-sm">
        <div class="text-h6 q-mb-md">Pagos</div>

        <q-list bordered separator>
          <q-item
            v-for="pay of emittedDte.pays"
            :key="pay.payType"
            class="q-py-md"
            style="font-size: 18px"
          >
            <q-item-section>
              <q-item-label
                >{{ pay.payType
                }}{{
                  pay.payType == 'Credito Cliente'
                    ? `: ${emittedDte.client.name}`
                    : ''
                }}</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-item-label>{{ formatter.currency(pay.amount) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="column items-end q-mt-lg" style="font-size: 18px">
          <div class="text-bold text-h6">
            TOTAL: {{ formatter.currency(emittedDte.totalAmount) }}
          </div>
          <div>TOTAL PAGADO: {{ formatter.currency(emittedDte.totalPay) }}</div>
          <div>VUELTO: {{ formatter.currency(emittedDte.changeAmount) }}</div>
        </div>
      </div>
    </div>
  </PageResponsive>
</template>
