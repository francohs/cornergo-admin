<script setup>
import { LocalStorage } from 'quasar'
import { useUsers } from 'stores/users'
import { computed, onMounted, provide, ref } from 'vue'

const users = useUsers()
provide(users.$id, users)

const actives = ref(LocalStorage.getItem('usersActives'))

onMounted(async () => await users.getDocs())

const filteredUsers = computed(() =>
  actives.value ? users.docs.filter(u => u.active) : users.docs
)

function saveActives() {
  LocalStorage.set('usersActives', actives.value)
}
</script>

<template>
  <PageResponsive :loading="users.loading" :maxWidth="650">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="row">
          <div class="text-h5">Usuarios</div>
          <q-toggle
            v-model="actives"
            @update:modelValue="saveActives"
            color="green"
            label="Solo Activos"
            class="q-ml-md"
          />
        </div>

        <ButtonLinkCreate :storeId="users.$id" />
      </div>

      <q-list v-if="filteredUsers.length > 0" bordered separator>
        <q-item
          clickable
          v-for="user of filteredUsers"
          :key="user._id"
          class="q-py-md"
          :to="{ name: 'users/:id', params: { id: user._id } }"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              :color="user.active ? 'primary' : 'grey'"
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
