<script setup lang="ts" generic="TData">
import type { Row } from '@tanstack/vue-table';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

defineProps<{
  row: Row<TData>;
}>();
</script>

<template>
  <div class="cursor-pointer no-select" @click="row.toggleExpanded()">
    <ChevronRight v-if="!row.getIsExpanded()" />
    <ChevronDown v-else />
  </div>
</template>

<style scoped></style>
