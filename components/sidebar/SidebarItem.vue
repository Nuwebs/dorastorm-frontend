<script setup lang="ts">
import { ref, watch } from 'vue';
import SidebarItemList from './SidebarItemList.vue';
import type { DsMenuItem } from '~/types/menu';

const props = defineProps<{
  item: DsMenuItem;
  collapsed: boolean;
}>();

// State of the accordion
const isOpen = ref(false);

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};

watch(props, (newValue, _) => {
  if (newValue.collapsed) {
    isOpen.value = false;
  }
});
</script>

<template>
  <div>
    <!-- Main item -->
    <div
      :class="`flex items-center p-4 cursor-pointer ${
        collapsed ? 'justify-center' : 'justify-between'
      }`"
      @click="item.items ? toggleAccordion() : null"
    >
      <div class="flex items-center">
        <i :class="`${item.icon} ${collapsed ? '' : 'mr-2'}`" />
        <template v-if="!collapsed">
          <NuxtLink v-if="item.to" :to="item.to">
            {{ item.name }}
          </NuxtLink>
          <span v-else>{{ item.name }}</span>
        </template>
      </div>
      <div v-if="item.items && !collapsed" :class="{ 'ml-2': !collapsed }">
        <i
          :class="{
            'rotate-90': isOpen,
            'rotate-0': !isOpen
          }"
          class="transition-transform pi pi-angle-right"
        />
      </div>
    </div>

    <!-- Subitems (accordion) -->
    <div v-if="item.items && isOpen" class="ml-8 border-l border-gray-700">
      <SidebarItemList :menu="item.items" :collapsed="collapsed" />
    </div>
  </div>
</template>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
