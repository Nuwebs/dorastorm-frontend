<template>
  <nav class="shadow-1 navbar">
    <Menubar class="py-3 px-6 h-full surface-section" :model="content">
      <template #start>
        <div class="flex align-items-center">
          <h3 class="my-0 mr-4">
            Dorastorm
          </h3>
          <slot name="start" />
        </div>
      </template>
      <template #end>
        <slot name="end" />
      </template>
    </Menubar>
  </nav>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { MenuItem } from 'primevue/menuitem';

defineProps<{
  content?: MenuItem[]
}>();
</script>
<style scoped>
.p-menubar {
  border: 0;
}

.navbar {
  height: 12vh;
  z-index: 10;
}
</style>
