<script setup>
import { nextTick, ref } from 'vue'
import formatter from 'tools/formatter'

const props = defineProps(['modelValue'])

const inputRef = ref(null)
const quantity = ref(props.modelValue)

async function focus() {
  await nextTick()
  inputRef.value.select()
}
function add() {
  if (quantity.value < 999) {
    quantity.value = formatter.decimal(quantity.value) + 1
  }
}
function substract() {
  if (quantity.value > 0) {
    quantity.value = formatter.decimal(quantity.value) - 1
  }
}
function numberValidation(event) {
  if (!/\d/.exec(event.key)) event.preventDefault()
}

defineExpose({ quantity })
</script>

<template>
  <q-input
    v-bind="$attrs"
    v-model="quantity"
    @focus="focus"
    @keypress="numberValidation"
    outlined
    pattern="[0-9]*"
    maxlength="3"
    dense
    input-style="width: 52px;"
    input-class="text-center"
    class="numcontrol"
    ref="inputRef"
  >
    <template v-slot:prepend>
      <q-btn dense flat icon="remove" @click="substract" />
    </template>
    <template v-slot:append>
      <q-btn dense flat icon="add" @click="add" />
    </template>
  </q-input>
</template>

<style>
.numcontrol.q-field--outlined .q-field__control {
  padding: 0 6px;
}
</style>
