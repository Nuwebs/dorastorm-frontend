<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { Menubar } from 'primevue';

defineProps<{
  content?: MenuItem[];
}>();
</script>

<template>
  <nav class="navbar">
    <Menubar
      class="py-3 px-5 h-full rounded-none border-none bg-surface-100"
      :model="content"
    >
      <template #start>
        <div class="flex align-items-center">
          <div class="font-semibold">DSF 4</div>
          <slot name="start" />
        </div>
      </template>
      <template #end>
        <slot name="end" />
      </template>
    </Menubar>
  </nav>
</template>

<style scoped>
.navbar {
  height: 12vh;
  z-index: 10;
  border-bottom: 1px solid var(--surface-border);
}

.navbar-logo {
  height: 6.5vh;
}
</style>
