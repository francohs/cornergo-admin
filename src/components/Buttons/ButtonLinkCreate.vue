<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(['storeId'])
const store = inject(props.storeId)

function go() {
  router.push({ name: `${props.storeId}/create` })
  store.clearDoc()
}
</script>

<template>
  <q-btn round icon="add" color="positive" class="q-ml-md" @click="go" />
</template>
