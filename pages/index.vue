<template>
  <div>
    <h1>Hello world!</h1>
    <h2>{{ $t('message.remember_me') }}</h2>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'guest'
})
</script>