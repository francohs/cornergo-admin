<script setup>
import { ref } from 'vue'

const props = defineProps(['cell'])
const editMode = ref(false)
</script>

<template>
  <q-td key="providers" :props="cell">
    <div v-if="editMode" class="row justify-center">
      <SelectProvider
        v-model="cell.row.providers"
        storeId="products"
        field="providers"
        :id="cell.row._id"
        @blur="editMode = false"
        @update:model-value="editMode = false"
        style="width: 240px"
        autofocus
        multiple
      />
    </div>

    <div v-else @dblclick="editMode = true">
      <q-chip v-for="provider of cell.row.providers">{{ provider }}</q-chip>
    </div>
  </q-td>
</template>
