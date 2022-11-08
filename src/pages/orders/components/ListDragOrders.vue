<template>
  <div class="text-h6 q-pa-md">
    {{ day.charAt(0).toUpperCase() + day.slice(1) }}
  </div>
  <q-separator />
  <Draggable
    v-model="orders.docs[day]"
    :id="day"
    itemKey="_id"
    group="days"
    :delay="100"
    :componentData="{
      class: 'q-list q-list--separator'
    }"
    @end="onEnd"
    delayOnTouchOnly="true"
    ghostClass="ghost"
    chosenClass="ghost"
    handle=".draggable"
    :sort="false"
  >
    <template #item="{ element: provider }">
      <q-item class="draggable q-py-sm" clickable @click="onClick(provider)">
        <q-item-section>
          <q-item-label>{{ provider.alias }}</q-item-label>
          <q-item-label caption lines="1">14-02-2022 13:55:25</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="check_circle" color="grey" />
        </q-item-section>
      </q-item>
    </template>
  </Draggable>
</template>

<script setup>
import Draggable from 'vuedraggable'
import { inject } from 'vue'
import { useProviders } from 'stores/providers'
import { useRouter } from 'vue-router'
// import moment from 'moment'

const router = useRouter()

const props = defineProps(['day'])

const orders = inject('orders')
const providers = useProviders()

function onClick(provider) {
  const { href } = router.resolve({
    name: 'orders/:id',
    params: { id: provider._id }
  })
  window.open(href, '_blank')
}

async function onEnd(event) {
  const provider = event.item._underlying_vm_
  const from = event.from.id.toLowerCase()
  const to = event.to.id.toLowerCase()

  if (from == to) return

  let orderDays = provider.orderDays.filter(day => day != from && day != to)

  await providers.update(provider._id, { orderDays: [to, ...orderDays] })
}

// function getDayNumber(day) {
//   const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
//   const today = moment()
//   const todayWeekDay = today.weekday() - 1
//   const weekDay = days.indexOf(props.day)
//   const addDays =
//     weekDay >= todayWeekDay
//       ? weekDay - todayWeekDay
//       : 7 + weekDay - todayWeekDay
//   return today.add(addDays, 'days').format('DD')
// }
</script>

<style>
.ghost {
  opacity: 0.2;
  background: #acacac;
}
.ghost .q-item__section {
  opacity: 0;
}
</style>
