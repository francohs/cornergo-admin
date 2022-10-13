<script setup>
import { onMounted, provide, ref } from 'vue'
import { useCashMoves } from 'stores/cashmoves'
import formatter from 'tools/formatter'

const cashMoves = useCashMoves()
provide(cashMoves.$id, cashMoves)

const page = ref(1)
const rowsPerPage = 10
const pages = ref(1)

onMounted(async () => {
  await getDocs()
  pages.value = Math.ceil(cashMoves.count / rowsPerPage)
})

const getDocs = async () => {
  await cashMoves.getQueryDocs({
    sort: { createdAt: -1 },
    pagination: {
      page: page.value,
      rowsPerPage
    },
    populate: ['user']
  })
}

const changePage = async () => {
  await getDocs()
}
</script>

<template>
  <PageResponsive :maxWidth="650">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <q-linear-progress
        indeterminate
        class="absolute-top"
        v-if="cashMoves.loading"
      />

      <div class="text-h5 q-mb-md">Cierres de Caja</div>

      <q-list v-if="cashMoves.docs.length > 0" bordered separator>
        <q-item
          v-for="cashMove of cashMoves.docs"
          :key="cashMove._id"
          class="q-py-sm"
          clickable
          :to="{ name: 'emitteddtes/:id', params: { id: cashMove._id } }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              icon="payments"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{
              formatter.datetime(cashMove.createdAt)
            }}</q-item-label>
            <q-item-label caption
              >Vendedor: {{ cashMove.user.name }}
              {{ cashMove.user.lastName }}</q-item-label
            >
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>INICIO</q-item-label>
            <q-item-label>{{
              formatter.currency(cashMove.openAmount)
            }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>CIERRE</q-item-label>
            <q-item-label>{{
              formatter.currency(cashMove.closeAmount)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-lg flex flex-center" v-if="pages > 1">
        <q-pagination
          v-model="page"
          :max="pages"
          :max-pages="5"
          @update:modelValue="changePage"
        />
      </div>

      <div
        v-if="cashMoves.docs.length == 0"
        class="q-mt-xl text-center text-grey-7"
        v-show="!cashMoves.loading"
      >
        Aún no tienes ventas
      </div>
    </div>
  </PageResponsive>
</template>
