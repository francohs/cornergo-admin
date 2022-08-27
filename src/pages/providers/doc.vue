<script setup>
import { useProviders } from 'stores/providers'
import { onMounted, provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const providers = useProviders()
const route = useRoute()
const router = useRouter()
const id = route.params.id
const provider = ref({})

provide(providers.$id, providers)

onMounted(async () => {
  await providers.getDoc(id)
  provider.value = { ...providers.doc }
})

const payTypes = ref(['Efectivo', 'Cheque', 'Transferencia'])
</script>

<template>
  <PageResponsive :loading="providers.loading">
    <FormSave :storeId="providers.$id" :id="id" :doc="provider">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h5">Datos Proveedor</div>
        </div>
        <div>
          <Toggle v-model="provider.shippingCosts" label="Costos de Envio" />
          <Toggle v-model="provider.active" label="Activo" />
        </div>
      </div>

      <RowMultiCols>
        <Input required v-model="provider.alias" label="Alias" class="col" />
        <Input
          required
          onlynumbers
          format="rut"
          v-model="provider.rut"
          label="RUT"
          class="col"
        />
      </RowMultiCols>
      <Input required v-model="provider.name" label="Nombre" class="fit" />

      <RowMultiCols>
        <SelectDays
          v-model="provider.orderDays"
          label="Días Pedidos"
          class="col"
        />
        <SelectDays
          v-model="provider.shippingDays"
          label="Días Recepción"
          class="col"
        />
        <Input
          label="Frecuencia Pedidos"
          onlynumbers
          v-model="provider.orderFrecuency"
          class="col-2"
        />
      </RowMultiCols>

      <RowMultiCols>
        <Select
          label="Forma de Pago"
          required
          v-model="provider.payMethod"
          :options="payTypes"
          class="col"
        />
        <Input
          v-model="provider.payTimeLimit"
          label="Plazo de Pago (días)"
          class="col"
        />
      </RowMultiCols>

      <Input
        v-model="provider.sellerName"
        label="Nombre Vendedor"
        class="fit"
      />

      <RowMultiCols>
        <Input
          email
          label="Correo"
          v-model="provider.email"
          class="col"
        /><Input
          onlynumbers
          label="Teléfono"
          v-model="provider.phone"
          class="col"
        />
      </RowMultiCols>

      <RowTimestamps v-if="provider._id" :doc="provider" />

      <div class="row justify-between q-mt-md">
        <ButtonDelete :storeId="providers.$id" :id="id" />

        <q-btn
          label="GUARDAR"
          color="positive"
          type="submit"
          class="q-ml-sm"
          :loading="providers.saving"
        />
      </div>
    </FormSave>
  </PageResponsive>
</template>
