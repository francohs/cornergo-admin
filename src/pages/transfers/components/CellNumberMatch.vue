<script setup>
import { inject, ref, nextTick } from 'vue'

const props = defineProps(['cell'])

const transfers = inject('transfers')

const editMode = ref(false)
const textValue = ref(props.cell.row.dteNumber)
const inputValue = ref(props.cell.row.dteNumber)
const inputRef = ref(null)

const editIn = async () => {
  editMode.value = true

  await nextTick()

  textValue.value = props.cell.row.dteNumber
  inputValue.value = props.cell.row.dteNumber
  inputRef.value.select()
}

const editOut = async event => {
  if (textValue.value !== inputValue.value) {
    if (event.key == 'Escape') {
      textValue.value = props.cell.row.dteNumber
    } else {
      await nextTick()
      textValue.value = inputValue.value
      await transfers.match({ ...props.cell.row, dteNumber: inputValue.value })
    }
  }
  editMode.value = false
}
</script>

<template>
  <q-td key="dteNumber" :props="cell">
    <q-input
      v-if="editMode"
      v-model="inputValue"
      ref="inputRef"
      dense
      outlined
      autofocus
      :loading="transfers.matching"
      @keyup.enter="editOut"
      @keyup.esc="editOut"
      @blur="editOut"
      input-class="text-center"
      class="full-width"
    />

    <div v-else @dblclick="editIn">
      <div v-if="textValue != ''" style="height: 40px; line-height: 40px">
        {{ textValue }}
      </div>
      <div v-else style="width: 50px; height: 40px"></div>
    </div>
  </q-td>
</template>
