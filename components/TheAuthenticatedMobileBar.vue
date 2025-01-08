<script setup lang="ts">
import type { DsMenuItem } from '~/types/menu';

defineProps<{
  menu: DsMenuItem[];
}>();
</script>

<template>
  <section class="w-full flex px-4 py-2 gap-4 justify-center overflow-x-auto">
    <NuxtLink
      v-for="(item, index) in menu"
      :key="`mb-${item.label}-${index}`"
      class="text-center"
      :to="item.to"
    >
      <i :class="item.icon" />
      <div>{{ item.label }}</div>
    </NuxtLink>
  </section>
</template>

<style scoped></style>
