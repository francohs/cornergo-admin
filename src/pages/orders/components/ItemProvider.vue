<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import formatter from 'tools/formatter'
import moment from 'moment'

const router = useRouter()

const props = defineProps(['provider', 'day'])

const daysOf = computed(() =>
  Math.abs(moment().diff(props.provider.lastOrder, 'days'))
)

const orderDone = computed(() => {
  const orderDays = props.provider.orderDays.length
  if (orderDays == 1) return daysOf.value < 6
  if (orderDays == 2) return daysOf.value < 3
})

function onClick(provider) {
  const { href } = router.resolve({
    name: 'orders/:id',
    params: { id: provider._id }
  })
  window.open(href, '_blank')
}
</script>

<template>
  <q-item class="q-py-sm" clickable @click="onClick(provider)">
    <q-item-section>
      <q-item-label>{{ provider.alias }}</q-item-label>
      <q-item-label caption lines="1">{{
        formatter.datetime(provider.lastOrder)
      }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <q-badge
          v-if="daysOf"
          outline
          class="q-mr-sm"
          color="grey"
          :label="daysOf"
        />
        <q-badge
          v-if="provider.checkStock"
          outline
          color="orange"
          :label="provider.checkStock"
          class="q-mr-sm"
        />
        <q-badge
          v-if="provider.noReceivedDtes"
          outline
          color="negative"
          :label="provider.noReceivedDtes"
          class="q-mr-sm"
        />
        <q-icon
          size="sm"
          name="check_circle"
          :color="orderDone ? 'positive' : 'grey'"
        />
      </div>
    </q-item-section>
  </q-item>
  <q-separator />
</template>
