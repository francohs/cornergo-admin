<script setup>
import formatter from 'tools/formatter'

const props = defineProps(['item'])
const emit = defineEmits(['remove'])

const subtract = () => {
  if (props.item.quantity > 1) {
    props.item.quantity--
  } else {
    emit('remove', props.item.product._id)
  }
}
</script>

<template>
  <q-item class="q-px-none">
    <div class="full-width row items-center q-pb-sm">
      <div class="q-mr-sm">
        <q-btn
          dense
          flat
          icon="clear"
          color="grey-7"
          @click="emit('remove', item.product._id)"
        />
      </div>
      <div class="row justify-start q-mr-md">
        <InputQuantity
          :modelValue="item.quantity"
          @add="item.quantity++"
          @subtract="subtract"
        />
      </div>
      <div class="col q-pr-md text-left" style="font-size: 18px">
        <q-item-label caption>Código: {{ item.product.code }} </q-item-label>
        <q-item-label>
          {{ item.product.name }}
        </q-item-label>
        <q-item-label caption>
          <span>Costo: {{ formatter.currency(item.product.cost) }}</span>
          <span class="q-ml-sm"
            >Precio: {{ formatter.currency(item.product.price) }}</span
          >
        </q-item-label>
      </div>
    </div>
  </q-item>
</template>
