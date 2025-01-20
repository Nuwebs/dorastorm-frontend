<script setup lang="ts">
import { Menubar } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';

defineProps<{
  content?: MenuItem[];
}>();
</script>

<template>
  <nav class="h-20 z-10 border-b border-gray-500">
    <Menubar class="py-4 px-5 h-full rounded-none border-none" :model="content">
      <template #start>
        <div class="flex align-items-center">
          <slot name="start">
            <div class="font-semibold">DSF 4</div>
          </slot>
        </div>
      </template>
      <template #end>
        <slot name="end" />
      </template>
    </Menubar>
  </nav>
</template>

<style scoped></style>
