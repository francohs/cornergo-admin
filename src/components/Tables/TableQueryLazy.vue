<script setup>
import { LocalStorage } from 'quasar'
import { inject, watch, onMounted } from 'vue'

const props = defineProps({
  storeId: String,
  tableName: String,
  columns: Array,
  title: String,
  titleIcon: String,
  activeToggle: Boolean,
  inputPlaceholder: String,
  minInput: { type: Number, default: 2 },
  withInput: Boolean,
  initFetch: Boolean,
  inputOnlynumbers: Boolean,
  forceSort: Object,
  createBtn: Boolean
})

const store = inject(props.storeId)
const table = store[props.tableName]

const onVisbleOrSort = async () => {
  if (store.docs.length == 0) return
  await queryInit()
}

const queryInit = async () => {
  table.pagination.page = 1
  await queryDocs()
  saveTable()
}

if (props.initFetch) {
  onMounted(async () => {
    await queryInit()
  })
}

// watch([table.equalFilter, table.dateFilter], async () => {
//   await queryInit()
// })

const onPagination = async pagination => {
  await queryNext(pagination.page)
  table.pagination.page = pagination.page
}

const queryNext = async (page = table.pagination.page) => {
  if (store.docs.length < store.count) {
    await queryDocs(page)
  }
  saveTable()
}

const queryInputDocs = async (page = table.pagination.page) => {
  if (table.input.length >= props.minInput) {
    await queryDocs(page)
  } else {
    if (props.initFetch) {
      await queryInit()
    } else {
      table.pagination.page = 1
      store.clearDocs()
    }
  }
}

const queryDocs = async (page = table.pagination.page) => {
  let sort
  if (props.forceSort) {
    sort = props.forceSort
  } else if (table.pagination.sortBy) {
    sort = {
      [table.pagination.sortBy]: table.pagination.descending ? -1 : 1
    }
  }

  let input = table.input ? table.input : ''
  input = props.inputOnlynumbers ? input.trim() : input

  await store.getQueryDocs({
    query: {
      contains: {
        fields: table.containsFields,
        value: input
      },
      equal: { ...table.equalFilter, active: table.actives },
      date: table.dateFilter
    },
    select: [...table.visibles, ...table.forceSelect],
    sort,
    pagination: {
      page,
      rowsPerPage: table.pagination.rowsPerPage
    },
    populate: table.populate
  })
}

const saveTable = () => {
  LocalStorage.set(props.tableName, table)
}

defineExpose({ queryInit })
</script>

<template>
  <Table
    v-bind="$attrs"
    :rows="store.docs"
    :columns="columns"
    :visible-columns="table.visibles"
    v-model:pagination="table.pagination"
    :loading="store.loading"
  >
    <template v-slot:top>
      <div class="full-width row items-center">
        <q-icon
          v-if="titleIcon"
          :name="titleIcon"
          size="sm"
          class="q-mx-none"
        />
        <div v-if="title" class="text-h6 q-mr-md q-ml-sm">{{ title }}</div>

        <InputTable
          v-if="withInput"
          v-model="table.input"
          :placeholder="inputPlaceholder"
          debounce="500"
          style="width: 350px"
          @update:modelValue="queryInputDocs()"
          :onlynumbers="inputOnlynumbers"
          class="q-mr-md"
        />

        <slot name="extracontrols" />

        <q-space />

        <ToggleActives
          v-if="activeToggle"
          v-model="table.actives"
          @update:modelValue="onVisbleOrSort"
        />

        <SelectTableVisibles
          v-model="table.visibles"
          :columns="columns"
          @update:modelValue="queryInit"
          class="q-ml-md"
        />

        <SelectTableSort
          v-if="!forceSort"
          v-model="table.pagination"
          :columns="columns"
          :visibles="table.visibles"
          @update:modelValue="queryInit"
          class="q-ml-md"
        />

        <ButtonLinkCreate :storeId="store.$id" v-if="createBtn" />
      </div>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <slot :props="props">
          <q-td v-for="column in columns" :key="column.name" :props="props">
            {{ props.row[column.name] }}
          </q-td>
        </slot>
      </q-tr>
    </template>

    <template v-slot:bottom>
      <div class="full-width row justify-between items-center">
        <div class="row items-center">{{ store.count }} Resultados</div>

        <div class="row items-center">
          <SelectRowsPerPage
            v-model="table.pagination.rowsPerPage"
            @update:modelValue="onVisbleOrSort"
          />

          <PaginationTable
            :pagination="table.pagination"
            :count="store.count"
            @update:pagination="onPagination"
          />
        </div>
      </div>
    </template>
  </Table>
</template>
