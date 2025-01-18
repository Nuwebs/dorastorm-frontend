<script setup lang="ts">
import { ref, computed } from 'vue';
import SidebarItemList from './SidebarItemList.vue';
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
  item: MenuItem;
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

/**
 * The handler currently only needs to do something if the item have subitems.
 * This is because even when the sidebar is collapsed the behavior is the same (navigate to the destination)
 * If the item has subitems, we need to check if the sidebar is collapsed and change the behaviour based on that.
 */
function handleItemClick(): void {
  if (!props.item.items) return;

  if (props.collapsed) {
    emit('expandSidebar');
    isOpen.value = true;
  } else {
    isOpen.value = !isOpen.value; // Toggle accordion
  }
}
</script>

<template>
  <div>
    <!-- Main item -->
    <div
      :class="`flex items-center p-4 cursor-pointer ${
        collapsed ? 'justify-center' : 'justify-between'
      } ${isOpen ? 'bg-highlight-emphasis' : 'hover:bg-emphasis'}`"
      @click="handleItemClick"
    >
      <NuxtLinkLocale :to="item.to" class="flex items-center">
        <i :class="`${item.icon} ${collapsed ? '' : 'mr-2'}`" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </NuxtLinkLocale>
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
