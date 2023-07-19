<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useCompanies } from 'stores/companies'

const companies = useCompanies()
const company = reactive({})
const newIP = ref('')
const companyId = '5fae93a5378e42182886b016'

onMounted(async () => {
  await companies.getDoc(companyId)
  Object.assign(company, companies.doc)
})

async function addIP() {
  if (isValidIP(newIP.value) != true) return
  companies.saving = true
  const whitelist = [...company.whitelist, { ip: newIP.value }]
  await companies.update(companyId, { whitelist }, 'IP de confianza añadida')
  Object.assign(company, companies.doc)
  companies.saving = false
  newIP.value = ''
}

async function removeIP(id) {
  companies.saving = true
  const whitelist = company.whitelist.filter(i => i._id != id)
  await companies.update(companyId, { whitelist }, 'IP de confianza removida')
  Object.assign(company, companies.doc)
  companies.saving = false
}

function isValidIP(str) {
  const noValidMsg = 'Ingresar una IP valida'
  let isTrue = str.split('.')
  if (isTrue.length != 4) return noValidMsg
  for (let i in isTrue) {
    if (
      !/^\d+$/g.test(isTrue[i]) ||
      +isTrue[i] > 255 ||
      +isTrue[i] < 0 ||
      /^[0][0-9]{1,2}/.test(isTrue[i])
    )
      return noValidMsg
  }
  return true
}
</script>

<template>
  <PageResponsive :loading="companies.loading" :maxWidth="650">
    <div class="q-pa-lg q-px-xs-md q-px-md-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="column">
          <div class="row text-h5 text-grey-8 items-center q-mb-md">
            <q-icon name="business" class="q-mr-sm" />CornerGO
          </div>

          <div class="row text-h5 text-grey-8 items-center q-mb-md">
            <q-icon name="share" class="q-mr-sm" />IPs de Confianza
            <q-spinner-dots
              color="primary"
              size="md"
              class="q-ml-md"
              v-if="companies.saving"
            />
          </div>

          <q-list
            v-if="company.whitelist && company.whitelist.length"
            bordered
            separator
            style="min-width: 300px"
            class="q-mb-sm"
          >
            <q-item v-for="item of company.whitelist">
              <q-item-section
                class="text-body1 text-grey-7 text-bold"
                style="font-size: 18px"
                >{{ item.ip }}</q-item-section
              >
              <q-item-section avatar>
                <q-btn
                  flat
                  color="grey-6"
                  icon="clear"
                  dense
                  round
                  @click="removeIP(item._id)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-input
            v-model="newIP"
            label="Nueva IP"
            outlined
            :rules="[isValidIP]"
            lazyRules
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="addIP"
                @keyup.enter="addIP"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </PageResponsive>
</template>
