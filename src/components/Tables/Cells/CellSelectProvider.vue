<script setup>
import { ref } from 'vue'

const props = defineProps(['cell', 'field'])
const editMode = ref(false)
// const model = ref(props.cell.row.providers)
// const loading = ref(false)
// const store = props.storeId ? inject('providers') : null

// async function update(value) {
//   loading.value = true
//   await store.update(props.cell.row._id, { providers: value })
//   model.value = props.modelValue
//   loading.value = false
// }
</script>

<template>
  <q-td :key="field" :props="cell">
    <div v-if="editMode" class="row justify-center">
      <SelectProvider
        v-model="cell.row.providerAlias"
        storeId="supplies"
        field="providerAlias"
        :id="cell.row._id"
        @blur="editMode = false"
        @update:model-value="editMode = false"
        style="width: 240px"
        autofocus
      />
    </div>

    <div v-else @dblclick="editMode = true">{{ cell.row.providerAlias }}</div>
  </q-td>
</template>
