<script setup>
import { locale } from 'tools/locale'
</script>

<template>
  <q-date
    v-bind="$attrs"
    square
    minimal
    no-unset
    :locale="locale"
    mask="YYYY-MM-DD"
  />
</template>
