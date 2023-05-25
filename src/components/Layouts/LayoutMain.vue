<template>
  <q-layout view="hHh Lpr lff" class="bg-grey-2">
    <Navbar @drawer-open="toggleDrawer" />

    <q-page-container>
      <Drawer v-model="drawerOpen" v-if="auth.isLogged" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { LocalStorage } from 'quasar'
import { useAuth } from 'stores/auth'
import { ref } from 'vue'

const auth = useAuth()

let localDrawerOpen = LocalStorage.getItem('drawer')
localDrawerOpen = localDrawerOpen === null ? false : localDrawerOpen
const drawerOpen = ref(localDrawerOpen)

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
  LocalStorage.set('drawer', drawerOpen.value)
}
</script>
