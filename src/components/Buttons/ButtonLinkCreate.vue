<template>
  <q-btn
    round
    icon="add"
    color="positive"
    class="q-ml-md"
    :to="{ name: `${storeId}/create` }"
  />
</template>

<script setup>
const props = defineProps(['storeId'])
</script>
