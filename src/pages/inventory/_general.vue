<script setup>
import { LocalStorage } from 'quasar'
import { provide, ref, computed } from 'vue'
import { useProducts } from 'stores/products'
import { useInventory } from 'stores/inventory'
import ItemInventory from './components/ItemInventory.vue'
import SearchInventory from './components/SearchInventory.vue'
import moment from 'moment'

const products = useProducts()
provide(products.$id, products)
const inventory = useInventory()
provide(inventory.$id, inventory)

const search = ref('')
const page = ref(1)
const pages = ref(1)
const rowPerPage = 10

const general = ref(LocalStorage.getItem('generalInventory'))
// clear()

const filteredItems = computed(() => {
  if (search.value.length < 3) {
    return inventory.docs.slice(
      rowPerPage * (page.value - 1),
      rowPerPage * page.value
    )
  }
  return inventory.docs
})

const checked = computed(() => {
  if (!inventory.docs.length) return 0
  return inventory.docs.reduce((acc, curr) => {
    if (!curr.lastStockUpdate) return acc
    let lastStockUpdate = moment(curr.lastStockUpdate)
    let diff = lastStockUpdate.diff(moment.now(), 'days')
    return diff < -7 || curr.stock < 0 ? acc : acc + 1
  }, 0)
})

async function queryDocs() {
  if (inventory.provider) {
    if (general.value) await inventory.getGeneralInventrory(inventory.provider)
    else await inventory.getDocs(inventory.provider)
    pages.value = Math.ceil(inventory.countDocs / rowPerPage)
  } else {
    clear()
  }
  page.value = 1
  LocalStorage.set('generalInventory', general.value)
}

async function getFilteredProducts() {
  if (search.value.length >= 3) {
    await inventory.getFilteredProducts(search.value)
  } else {
    clear()
  }
}

function clear() {
  inventory.provider = null
  inventory.clearDocs()
  pages.value = 1
  page.value = 1
}
</script>

<template>
  <q-page class="column">
    <div>
      <div
        class="row justify-between items-center text-weight-medium q-px-md q-my-sm text-grey-9"
      >
        <div class="row items-center">
          <div class="row items-center text-h5 text-weight-medium">
            <q-icon class="q-mr-sm" name="phone_android"></q-icon>
            <div v-if="inventory.countDocs">
              Revisados {{ checked }} / {{ inventory.countDocs }}
            </div>
            <div v-else>Inventario Movil</div>
          </div>
        </div>

        <q-toggle
          v-model="general"
          color="green"
          label="General"
          class="q-ml-md"
          @update:modelValue="queryDocs"
        />
      </div>

      <SearchInventory
        v-model="search"
        @update:modelValue="getFilteredProducts"
        class="q-mb-md"
      />

      <SelectProvider
        label="Proveedor"
        icon="local_shipping"
        v-model="inventory.provider"
        @update:modelValue="queryDocs"
        class="full-width q-mb-md"
        clearable
        @clear="queryDocs"
        v-if="search.length < 3"
      />

      <div v-if="!search" class="row justify-center q-mb-md">
        <q-pagination
          v-model="page"
          :max="pages"
          color="grey-7"
          v-if="pages > 1"
        />
      </div>

      <q-linear-progress
        indeterminate
        class="absolute"
        v-if="inventory.loading"
      />
      <q-separator />

      <ItemInventory
        v-for="product of filteredItems"
        :product="product"
        :key="product._id"
        :search="search"
      />
    </div>
  </q-page>
</template>
