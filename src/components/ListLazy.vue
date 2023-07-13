<script setup>
import { ref, computed, inject, onMounted } from 'vue'

const props = defineProps([
  'storeId',
  'query',
  'sort',
  'rowsPerPage',
  'noItems'
])

const store = inject(props.storeId)

const page = ref(1)
const pages = ref(1)

onMounted(async () => {
  await getDocs(1)
  pages.value = Math.ceil(store.count / props.rowsPerPage)
})

async function getDocs(page) {
  await store.getQueryDocs({
    query: props.query,
    sort: props.sort,
    pagination: {
      page,
      rowsPerPage: props.rowsPerPage
    }
  })
}

async function changePage(newPage) {
  if (newPage > page.value && store.docs.length < newPage * props.rowsPerPage) {
    await getDocs(newPage)
  }
  page.value = newPage
}

const docs = computed(() =>
  store.docs.slice(
    props.rowsPerPage * (page.value - 1),
    props.rowsPerPage * page.value
  )
)
</script>

<template>
  <q-linear-progress indeterminate class="absolute-top" v-if="store.loading" />

  <q-list v-if="store.docs.length > 0" bordered separator>
    <slot :docs="docs" />
  </q-list>

  <div class="q-pa-lg flex flex-center" v-if="pages > 1">
    <q-pagination
      :modelValue="page"
      :max="5"
      @update:modelValue="changePage"
      direction-links
    />
  </div>

  <div v-else class="q-mt-xl text-center text-grey-7" v-show="!store.loading">
    {{ noItems }}
  </div>
</template>
