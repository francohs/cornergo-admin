<template>
  <div class="q-pa-md">
    <!-- :visible-columns="table.visibles" -->
    <q-table
      :rows="filteredRows"
      :columns="columns"
      v-model:pagination="pagination"
      :loading="loading"
      row-key="_id"
      separator="cell"
      no-data-label="No se han encontrado datos"
      no-results-label="No se encuentran resultados"
      loading-label="Cargando datos..."
      color="primary"
      :wrap-cells="false"
    >
      <template v-slot:top>
        <div class="full-width row items-center q-gutter-x-sm">
          <q-icon :name="titleIcon" size="sm" class="q-mx-none" />
          <div class="text-h6 q-mr-md">{{ title }}</div>

          <InputTable
            v-model="input"
            debounce="0"
            :placeholder="inputPlaceholder"
            style="width: 268px"
          />

          <!-- <SelectTableVisibles
            v-model="table.visibles"
            :columns="columns"
            @update:modelValue="queryInit"
          />

          <SelectTableSort
            v-model="table.pagination"
            :columns="columns"
            :visibles="table.visibles"
            @update:modelValue="queryNext"
          /> -->

          <slot name="extracontrols" />
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

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-8 q-gutter-sm">
          <span>
            {{ loading ? 'Cagando datos...' : noDataText }}
          </span>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="full-width row justify-between items-center">
          <div class="row items-center">
            {{ filteredRows.length }} Resultados

            <ToggleActives v-if="activeToggle" v-model="actives" />
          </div>

          <div class="row items-center">
            <SelectRowsPerPage v-model="pagination.rowsPerPage" />

            <PaginationTable
              :pagination="pagination"
              :count="filteredRows.length"
              @update:page="pagination.page = $event"
            />
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  rows: Array,
  columnsProps: Array,
  noDataText: String,
  title: String,
  titleIcon: String,
  activeToggle: Boolean,
  inputPlaceholder: String,
  filteredFields: Array,
  loading: Boolean
})

const input = ref('')
const pagination = ref({
  sortBy: '',
  descending: false,
  page: 1,
  rowsPerPage: 5
})
const actives = ref(null)

const columns = props.columnsProps.map(col => {
  col.style = col.size ? `width: ${col.size}px` : 'width: 200px'
  col.align = col.align || 'center'
  col.field = col.field || col.name
  col.sortable = col.sortable == undefined ? false : col.sortable
  return col
})
const allColumns = props.columnsProps.map(col => col.name)

const filteredRows = computed(() => {
  let filteredRows = props.rows

  if (actives.value) {
    filteredRows = props.rows.filter(row => row.active === actives.value)
  }

  if (input.value) {
    filteredRows = props.rows.filter(row => {
      for (let field of props.filteredFields) {
        let rowValue = row[field]
        if (
          rowValue &&
          rowValue.toUpperCase().includes(input.value.toUpperCase())
        ) {
          return true
        }
      }
      return false
    })
  }

  return filteredRows
})
</script>
