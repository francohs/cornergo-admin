<script setup>
import { computed, watch, ref, inject, nextTick } from 'vue'
import formatter from 'tools/formatter'

const props = defineProps({
  storeId: String,
  id: String,
  field: String,
  modelValue: [String, Number],
  hintManual: [String, Number],
  hintAuto: [String, Number],
  format: String,
  autoField: String,
  autoValue: Number,
  isAuto: Boolean,
  hideAutoBtn: Boolean
})

const emit = defineEmits(['update:isAuto', 'update:modelValue'])

const isFocus = ref(false)
const inputRef = ref(null)
const store = props.storeId ? inject(props.storeId) : null
const loading = ref(false)

const formatedValue = computed(() => {
  let value = props.modelValue
  if (props.isAuto) {
    value = props.autoValue
  }
  console.log(isFocus.value, props.isAuto, props.format)
  if ((!isFocus.value || props.isAuto) && props.format) {
    value = formatter[props.format](value)
  }
  return value
})

let prevModelValue = props.modelValue
watch(isFocus, async () => {
  if (
    props.storeId &&
    !isFocus.value &&
    !props.isAuto &&
    prevModelValue != props.modelValue
  ) {
    loading.value = true
    await store.update(props.id, { [props.field]: props.modelValue })
    loading.value = false
  } else {
    prevModelValue = props.modelValue
  }
})

async function onClickAuto() {
  if (props.storeId) {
    loading.value = true
    await store.update(props.id, { [props.autoField]: !props.isAuto })
    loading.value = false
  }
  if (!props.isAuto) {
    emit('update:modelValue', props.autoValue)
  } else {
    onFocus()
  }
  emit('update:isAuto', !props.isAuto)
}

const onFocus = async () => {
  isFocus.value = true
  await nextTick()
  inputRef.value.onFocus()
}
</script>

<template>
  <Input
    v-bind="$attrs"
    :modelValue="formatedValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :readonly="isAuto"
    :class="{ readonly: isAuto }"
    @focus="onFocus"
    @blur="isFocus = false"
    @keyup.enter="isFocus = false"
    bottom-slots
    stack-label
    :loading="loading"
    onlynumbers
    ref="inputRef"
  >
    <template v-if="!hideAutoBtn" v-slot:append>
      <q-btn
        dense
        size="sm"
        flat
        v-if="!loading"
        :icon="isAuto ? 'autorenew' : 'autorenew'"
        :color="isAuto ? 'primary' : 'grey'"
        @click="onClickAuto"
      >
        <q-tooltip>{{
          isAuto ? 'Cambiar a manual' : 'Cambiar a automático'
        }}</q-tooltip>
      </q-btn>
    </template>
    <template v-slot:hint>
      <span v-if="isAuto && hintManual">{{ hintManual }}</span>
      <span v-if="!isAuto && hintAuto">{{ hintAuto }}</span>
    </template>
  </Input>
</template>
