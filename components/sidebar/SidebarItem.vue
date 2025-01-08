<script setup lang="ts">
import { ref, computed } from 'vue';
import SidebarItemList from './SidebarItemList.vue';
import type { DsMenuItem } from '~/types/menu';

const props = defineProps<{
  item: DsMenuItem;
  collapsed: boolean;
}>();
const emit = defineEmits<{
  expandSidebar: [];
}>();

// State of the accordion
const isOpen = ref<boolean>(false);

// Derived state: Determines whether the accordion should be open
const isAccordionOpen = computed<boolean>(
  () => !props.collapsed && isOpen.value
);

function handleItemClick(): void {
  if (props.collapsed) {
    // Expand sidebar first
    emit('expandSidebar');
  } else if (props.item.items) {
    // Toggle accordion
    isOpen.value = !isOpen.value;
  }
}
</script>

<template>
  <div>
    <!-- Main item -->
    <div
      :class="`flex items-center p-4 cursor-pointer ${
        collapsed ? 'justify-center' : 'justify-between'
      }`"
      @click="handleItemClick"
    >
      <NuxtLink :to="item.to" class="flex items-center">
        <i :class="`${item.icon} ${collapsed ? '' : 'mr-2'}`" />
        <span v-if="!collapsed">{{ item.name }}</span>
      </NuxtLink>
      <div v-if="item.items && !collapsed" :class="{ 'ml-2': !collapsed }">
        <i
          :class="{
            'rotate-90': isAccordionOpen,
            'rotate-0': !isAccordionOpen
          }"
          class="transition-transform pi pi-angle-right"
        />
      </div>
    </div>

    <!-- Subitems (accordion) -->
    <div
      v-if="item.items && isAccordionOpen"
      class="ml-8 border-l border-gray-700"
    >
      <SidebarItemList :menu="item.items" :collapsed="collapsed" />
    </div>
  </div>
</template>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
