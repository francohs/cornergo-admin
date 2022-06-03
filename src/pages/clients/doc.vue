<template>
  <PageResponsive :loading="clients.loading">
    <FormSave :storeId="clients.$id" :id="id" :doc="client">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h5">Datos Cliente</div>
        </div>
        <div>
          <q-toggle
            v-model="client.isCredit"
            color="green"
            label="Usa Crédito"
          />
          <q-toggle v-model="client.active" color="green" label="Activo" />
        </div>
      </div>

      <RowMultiCols>
        <Input required v-model="client.name" label="Nombre" class="col" />
        <Input
          required
          onlynumbers
          format="rut"
          v-model="client.rut"
          label="RUT"
          class="col"
        />
      </RowMultiCols>

      <Input label="Dirección" v-model="client.address" class="fit" />

      <RowMultiCols>
        <Input
          required
          email
          label="Correo"
          v-model="client.email"
          class="col"
        /><Input
          onlynumbers
          label="Teléfono"
          v-model="client.phone"
          class="col"
        />
      </RowMultiCols>

      <RowMultiCols>
        <Input
          label="Saldo"
          v-model="client.balance"
          format="currency"
          class="col"
        />
        <Input
          label="Crédito Máximo"
          v-model="client.maxCredit"
          format="currency"
          class="col"
        />
      </RowMultiCols>

      <RowTimestamps v-if="client._id" :doc="client" />

      <div class="row justify-between q-mt-md">
        <ButtonDelete :storeId="clients.$id" :id="id" />

        <div>
          <q-btn
            label="GUARDAR"
            color="positive"
            type="submit"
            :loading="clients.saving"
          />
        </div>
      </div>
    </FormSave>

    <Dialog
      title="Cambiar Contraseña"
      v-model="dialogPassword"
      @confirm="updatePasswornd"
      :loading="clients.saving"
    >
      <form>
        <Input
          required
          password
          autofocus
          v-model="password1"
          label="Nueva contraseña"
        />
        <Input
          required
          password
          v-model="password2"
          :passwordConfirm="password1"
          label="Confirmar nueva contraseña"
        />
      </form>
    </Dialog>
  </PageResponsive>
</template>

<script>
import { useClients } from 'stores/clients'
import { onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'UsersDoc',
  setup() {
    const clients = useClients()
    const $route = useRoute()
    const id = $route.params.id
    const client = ref({})
    const dialogPassword = ref(false)
    const password1 = ref('')
    const password2 = ref('')

    provide(clients.$id, clients)

    onMounted(async () => {
      await clients.getDoc(id)
      client.value = { ...clients.doc }
    })

    async function updatePasswornd() {
      await clients.updatePassword(id, { password: password1.value })
      dialogPassword.value = false
      password1.value = ''
      password2.value = ''
    }

    return {
      id,
      client,
      clients,
      dialogPassword,
      password1,
      password2,
      updatePasswornd
    }
  }
}
</script>
