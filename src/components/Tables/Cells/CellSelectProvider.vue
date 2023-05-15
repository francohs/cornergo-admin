<script setup>
import { ref } from 'vue'

const props = defineProps(['cell'])
const editMode = ref(false)
</script>

<template>
  <q-td key="providerAlias" :props="cell">
    <div v-if="editMode" class="row justify-center">
      <SelectProvider
        v-model="cell.row.providerAlias"
        storeId="supplies"
        field="providerAlias"
        :id="cell.row._id"
        @blur="editMode = false"
        @update:model-value="editMode = false"
        dense
        autofocus
      />
      <!-- style="width: 240px" -->
    </div>

    <div
      v-else
      @dblclick="editMode = true"
      style="height: 40px; line-height: 40px"
    >
      {{ cell.row.providerAlias }}
    </div>
  </q-td>
</template>
