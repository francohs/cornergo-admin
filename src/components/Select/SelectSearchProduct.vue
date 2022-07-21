<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'

const emit = defineEmits(['chose'])

const inputValue = ref('')
const options = ref([])
const selectRef = ref('')

const filterFn = async (value, update) => {
  if (value.length > 2) {
    const { data } = await api.post('products/query', {
      query: {
        contains: {
          fields: ['code', 'name'],
          value
        }
      },
      select: [
        'code',
        'name',
        'stock',
        'price',
        'exempt',
        'providers',
        'active'
      ],
      sort: { totalSales: -1 }
    })

    options.value = data.docs
  } else {
    options.value = []
  }
  update()
}

const addItem = product => {
  emit('chose', product)
  clear()
}

const onEnter = () => {
  let selectedProduct = options.value.find(
    product => product.name == inputValue.value
  )

  if (selectedProduct) {
    addItem(selectedProduct)
  }
}

const clear = () => {
  inputValue.value = ''
  selectRef.value.clear()
  // selectRef.value.focus()
}
</script>

<template>
  <Select
    v-bind="$attrs"
    outlined
    behavior="menu"
    ref="selectRef"
    :model-value="inputValue"
    @input-value="inputValue = $event"
    :options="options"
    use-input
    hide-selected
    fill-input
    input-debounce="300"
    option-value="name"
    option-label="name"
    emit-value
    @filter="filterFn"
    @keyup.enter="onEnter"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" @click="addItem(scope.opt)">
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
          <q-item-label caption
            >Código: {{ scope.opt.code }} ({{ scope.opt.providers.join(', ') }})
            {{ scope.opt.active ? '' : '(no activo)' }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:prepend>
      <q-icon name="search" @click.stop />
    </template>
    <template v-slot:append>
      <q-icon
        v-if="inputValue"
        name="cancel"
        @click.stop="clear"
        class="cursor-pointer"
      />
    </template>
  </Select>
</template>
