<script setup lang="ts">
import { ref } from 'vue';
import MobileBarItemAccordion from './mobilebar/MobileBarItemAccordion.vue';
import {
  UiDrawer,
  UiDrawerContent,
  UiDrawerHeader,
  UiDrawerTitle
} from './ui/drawer';
import type { DsMenuItem } from '~/types/menu';

defineProps<{
  menu: DsMenuItem[];
}>();

const drawerVisible = ref<boolean>(false);
const selectedItem = ref<DsMenuItem | null>(null);

function handleClick(item: DsMenuItem): void {
  if (!item.items) return;

  selectedItem.value = item;
  drawerVisible.value = true;
}

function handleNavigated(): void {
  drawerVisible.value = false;
  selectedItem.value = null;
}

function handleCloseAnimation(): void {
  // Do nothing if the drawer is opened
  if (drawerVisible.value) return;
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
    <UiDrawer
      :open="drawerVisible"
      direction="bottom"
      @update:open="(payload: boolean) => drawerVisible = payload"
      @animation-end="handleCloseAnimation()"
    >
      <UiDrawerContent>
        <UiDrawerHeader>
          <UiDrawerTitle class="text-center">
            {{ String(selectedItem?.label) ?? 'Error' }}
          </UiDrawerTitle>
        </UiDrawerHeader>

        <div class="mt-2 px-4">// Content</div>
      </UiDrawerContent>
    </UiDrawer>
    <!-- <Drawer
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
    </Drawer> -->
  </section>
</template>
