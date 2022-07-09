<template>
  <PageResponsive :loading="users.loading" :maxWidth="650">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5">Usuarios</div>

        <ButtonLinkCreate :storeId="users.$id" />
      </div>

      <q-list v-if="users.docs.length > 0" bordered separator>
        <q-item
          clickable
          v-for="user of users.docs"
          :key="user._id"
          class="q-py-md"
          :to="{ name: 'users/:id', params: { id: user._id } }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              icon="person"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.name }} {{ user.lastname }}</q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
          </q-item-section>

          <q-item-section side>{{
            user.isAdmin ? 'Administrador' : 'Trabajador'
          }}</q-item-section>
        </q-item>
      </q-list>

      <div
        v-if="users.docs.length == 0"
        class="q-mt-xl text-center text-grey-7"
      >
        Aún no tienes usuarios
      </div>
    </div>
  </PageResponsive>
</template>

<script>
import { useUsers } from 'stores/users'
import { onMounted, provide } from 'vue'

export default {
  name: 'UsersDocs',
  setup() {
    const users = useUsers()
    provide(users.$id, users)

    onMounted(async () => await users.getDocs())

    return {
      users
    }
  }
}
</script>
