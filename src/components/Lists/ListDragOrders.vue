<template>
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
      <q-item class="draggable q-py-sm" clickable v-ripple>
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

const props = defineProps(['day'])

const orders = inject('orders')
const providers = useProviders()

const onEnd = async event => {
  const provider = event.item._underlying_vm_
  const from = event.from.id.toLowerCase()
  const to = event.to.id.toLowerCase()

  if (from == to) return

  let orderDays = provider.orderDays.filter(day => day != from && day != to)

  await providers.update(provider._id, { orderDays: [to, ...orderDays] })
}
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
