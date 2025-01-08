<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth-guard']
});
</script>

<template>
  <div>Page: test</div>
</template>

<style scoped></style>
