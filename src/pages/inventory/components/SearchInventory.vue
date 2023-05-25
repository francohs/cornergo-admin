<script setup>
const props = defineProps(['modelValue'])
</script>

<template>
  <q-input
    outlined
    v-bind="$attrs"
    :modelValue="modelValue"
    color="primary"
    placeholder="Buscar por nombre o código"
  >
    <template v-slot:append>
      <q-icon name="search" />
      <q-icon
        name="cancel"
        v-if="modelValue.length > 0"
        @click="$emit('update:modelValue', '')"
        class="cursor-pointer"
        color="grey-7"
      />
    </template>
  </q-input>
</template>
