<template>
  <nav class="shadow-1 navbar">
    <Menubar class="py-3 px-6 h-full" :model="content">
      <template #start>
        <slot name="start"></slot>
      </template>
      <template #end>
        <slot name="end"></slot>
      </template>
    </Menubar>
  </nav>
</template>

<script setup lang="ts">
import Menubar from "primevue/menubar";
import { MenuItem } from "primevue/menuitem";

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
}
</style>