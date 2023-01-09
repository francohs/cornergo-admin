<script setup>
import { useClients } from 'stores/clients'
import { provide, ref } from 'vue'
import { useRouter } from 'vue-router'

const clients = useClients()
const router = useRouter()
const client = ref({
  isCredit: true,
  active: true,
  maxCredit: 100000
})

provide(clients.$id, clients)
</script>

<template>
  <PageResponsive :loading="clients.loading">
    <FormSave :storeId="clients.$id" :doc="client">
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

      <div class="row justify-between q-mt-md">
        <q-btn
          label="GUARDAR"
          color="positive"
          type="submit"
          class="q-ml-sm"
          :loading="clients.saving"
        />
      </div>
    </FormSave>
  </PageResponsive>
</template>
