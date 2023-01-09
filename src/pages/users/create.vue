<script setup>
import { reactive, provide, ref } from 'vue'
import { useUsers } from 'stores/users'

const users = useUsers()
const user = reactive({})
user.isAdmin = false
const passwordConfirm = ref('')
provide(users.$id, users)
</script>

<template>
  <PageResponsive :loading="users.loading">
    <FormSave :storeId="users.$id" :doc="user">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h5">Crear Usuario</div>
        </div>
        <q-toggle v-model="user.isAdmin" color="green" label="Administrador" />
      </div>

      <RowMultiCols>
        <Input required v-model="user.username" label="Usuario" class="col" />
        <Input
          required
          onlynumbers
          rut
          v-model="user.rut"
          format="rut"
          label="RUT"
          class="col"
        />
      </RowMultiCols>

      <Input
        required
        email
        label="Correo"
        v-model="user.email"
        class="full-width"
      />

      <RowMultiCols>
        <Input required v-model="user.name" label="Nombre" class="col" />
        <Input required v-model="user.lastName" label="Apellido" class="col" />
      </RowMultiCols>

      <RowMultiCols>
        <Input
          password
          required
          v-model="user.password"
          label="Nueva contraseña"
          class="col"
        />
        <Input
          password
          required
          v-model="passwordConfirm"
          :passwordConfirm="user.password"
          label="Confirmar nueva contraseña"
          class="col"
        />
      </RowMultiCols>

      <div class="row justify-end q-mt-md">
        <q-btn
          label="GUARDAR"
          color="positive"
          type="submit"
          :loading="users.saving"
        />
      </div>
    </FormSave>
  </PageResponsive>
</template>
