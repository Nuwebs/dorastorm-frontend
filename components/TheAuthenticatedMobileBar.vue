<script setup lang="ts">
import { Drawer } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import { ref } from 'vue';
import MobileBarItemAccordion from './mobilebar/MobileBarItemAccordion.vue';

defineProps<{
  menu: MenuItem[];
}>();

const drawerVisible = ref<boolean>(false);
const selectedItem = ref<MenuItem | null>(null);

function handleClick(item: MenuItem): void {
  if (!item.items) return;

  selectedItem.value = item;
  drawerVisible.value = true;
}

function handleNavigated(): void {
  drawerVisible.value = false;
  selectedItem.value = null;
}
</script>

<template>
  <section class="flex px-4 py-2 gap-4 border-t border-gray-500">
    <NuxtLink
      v-for="(item, index) in menu"
      :key="`mb-${item.label}-${index}`"
      class="text-center cursor-pointer"
      :to="item.to"
      @click="handleClick(item)"
    >
      <i :class="item.icon" />
      <div>{{ item.label }}</div>
    </NuxtLink>
    <Drawer
      v-model:visible="drawerVisible"
      position="bottom"
      :header="String(selectedItem?.label) ?? 'Error'"
      class="mobilebar-drawer-h"
      @hide="selectedItem = null"
    >
      <MobileBarItemAccordion
        v-if="selectedItem"
        :item="selectedItem"
        @navigated="handleNavigated"
      />
      <p v-else>Error</p>
    </Drawer>
  </section>
</template>
