<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth-guard']
});
</script>

<template>
  <div>
    <div class="h-screen bg-red-500">aa</div>
    <div class="h-screen bg-blue-500">ab</div>
  </div>
</template>

<style scoped></style>
