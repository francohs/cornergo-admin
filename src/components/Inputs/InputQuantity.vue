<template>
  <q-input
    v-bind="$attrs"
    outlined
    pattern="[0-9]*"
    maxlength="3"
    dense
    input-style="width: 52px;"
    input-class="text-center"
    class="numcontrol readonly"
  >
    <template v-slot:prepend>
      <q-btn dense flat icon="remove" @click="$emit('subtract')" />
    </template>
    <template v-slot:append>
      <q-btn dense flat icon="add" @click="$emit('add')" />
    </template>
  </q-input>
</template>

<style>
.numcontrol.q-field--outlined .q-field__control {
  padding: 0 6px;
}
.readonly.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.24);
}
</style>
