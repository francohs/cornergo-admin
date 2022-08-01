<script>
import { provide, ref } from 'vue'
import { useProviders } from 'stores/providers'

export default {
  setup() {
    const providers = useProviders()
    const provider = ref({
      rut: providers.doc.rut,
      name: providers.doc.name,
      payMethod: 'Efectivo',
      payTimeLimit: 0,
      orderFrecuency: 7,
      orderDays: [],
      shippingDays: [],
      active: true
    })
    provide(providers.$id, providers)

    return {
      provider,
      providers
    }
  },
  name: 'ProvidersCreate'
}
</script>

<template>
  <PageResponsive :loading="providers.loading">
    <FormSave :storeId="providers.$id" :doc="provider">
      <div class="row items-center justify-between q-pb-lg">
        <div class="row">
          <ButtonBack />
          <div class="text-h5">Crear Proveedor</div>
        </div>
        <q-toggle v-model="provider.active" color="green" label="Activo" />
      </div>

      <RowMultiCols>
        <Input
          label="RUT"
          v-model="provider.rut"
          format="rut"
          required
          class="col"
        />
        <Input
          label="Alias"
          v-model="provider.alias"
          format="uppercase"
          required
          class="col"
        />
      </RowMultiCols>

      <Input
        label="Razón Social"
        v-model="provider.name"
        required
        class="full-width"
      />

      <RowMultiCols>
        <Select
          label="Método Pago"
          v-model="provider.payMethod"
          :options="['Efectivo', 'Cheque', 'Transferencia']"
          class="col"
        />
        <Input
          label="Plazo Pago"
          v-model="provider.payTimeLimit"
          :disabled="provider.payMethod == 'Efectivo'"
          onlynumbers
          class="col"
        />
      </RowMultiCols>

      <RowMultiCols class="q-mb-md">
        <SelectDays label="Días Pedidos" v-model="provider.orderDays" />
        <SelectDays label="Días Despacho" v-model="provider.shippingDays" />
      </RowMultiCols>

      <RowMultiCols>
        <Input
          label="Frecuencia Pedidos (días)"
          v-model="provider.orderFrecuency"
          onlynumbers
          class="col"
        />
        <Input
          label="Nombre Vendedor"
          v-model="provider.sellerName"
          class="col"
        />
      </RowMultiCols>

      <RowMultiCols>
        <Input label="Email" v-model="provider.email" email class="col" />
        <Input
          label="Teléfono"
          v-model="provider.phone"
          onlynumbers
          class="col"
        />
      </RowMultiCols>

      <div class="row justify-end q-mt-md">
        <q-btn
          label="GUARDAR"
          color="positive"
          type="submit"
          :loading="provider.saving"
        />
      </div>
    </FormSave>
  </PageResponsive>
</template>
