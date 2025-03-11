<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import type { ButtonVariants } from '~/components/ui/button';
import UiButton from '~/components/ui/button/UiButton.vue';

defineProps<{
  variant?: ButtonVariants['variant'];
  loading?: boolean;
}>();
</script>

<template>
  <UiButton :variant="variant" :loading="loading">
    <Search v-if="!loading" />
  </UiButton>
</template>

<style scoped></style>
