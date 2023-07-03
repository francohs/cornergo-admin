<script>
import axios from 'axios'

async function getIP() {
  const response = await axios.get('https://api.db-ip.com/v2/free/self')

  console.log(response.data.ipAddress)
}
getIP()
</script>

<template>
  <q-page class="flex flex-center row">
    <q-img src="~assets/logo.png" style="height: 280px; max-width: 280px" />
  </q-page>
</template>
