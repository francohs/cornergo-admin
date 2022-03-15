<template>
  <PageResponsive :loading="users.loading">
    <FormSave :storeId="users.$id" :id="id" :doc="user">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h5">Datos Usuario</div>
        </div>
        <div>
          <q-toggle
            v-model="user.isAdmin"
            color="green"
            label="Administrador"
          />
          <q-toggle v-model="user.active" color="green" label="Activo" />
        </div>
      </div>

      <RowMultiCols>
        <Input required v-model="user.username" label="Usuario" class="col" />
        <Input
          required
          onlynumbers
          rut
          v-model="user.rut"
          label="RUT"
          class="col"
        />
      </RowMultiCols>

      <Input required email label="Correo" v-model="user.email" class="fit" />

      <RowMultiCols>
        <Input required v-model="user.name" label="Nombre" class="col" />
        <Input required v-model="user.lastName" label="Apellido" class="col" />
      </RowMultiCols>

      <RowTimestamps v-if="user._id" :doc="user" />

      <div class="row justify-between q-mt-md">
        <ButtonDelete :storeId="users.$id" :id="id" />

        <div>
          <q-btn
            label="CAMBIAR CONTRASEÑA"
            class="text-grey-7 q-mr-sm"
            @click="dialogPassword = true"
          />
          <q-btn
            label="GUARDAR"
            color="positive"
            type="submit"
            :loading="users.saving"
          />
        </div>
      </div>
    </FormSave>

    <Dialog
      title="Cambiar Contraseña"
      v-model="dialogPassword"
      @confirm="updatePasswornd"
      :loading="users.saving"
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
import { useUsers } from 'stores/users'
import { onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'UsersDoc',
  setup() {
    const users = useUsers()
    const $route = useRoute()
    const id = $route.params.id
    const user = ref({})
    const dialogPassword = ref(false)
    const password1 = ref('')
    const password2 = ref('')

    provide(users.$id, users)

    onMounted(async () => {
      await users.getDoc(id)
      user.value = { ...users.doc }
    })

    async function updatePasswornd() {
      await users.updatePassword(id, { password: password1.value })
      dialogPassword.value = false
      password1.value = ''
      password2.value = ''
    }

    return {
      id,
      user,
      users,
      dialogPassword,
      password1,
      password2,
      updatePasswornd
    }
  }
}
</script>
