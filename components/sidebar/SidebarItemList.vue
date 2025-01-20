<script setup lang="ts">
import SidebarItem from './SidebarItem.vue';
import type { DsMenuItem } from '~/types/menu';

defineProps<{
  menu: DsMenuItem[];
  collapsed: boolean;
}>();

const emit = defineEmits<{
  expandSidebar: [];
}>();
</script>

<template>
  <ul>
    <li v-for="(item, index) in menu" :key="`sb-${item.label}-${index}`">
      <SidebarItem
        :item="item"
        :collapsed="collapsed"
        @expand-sidebar="emit('expandSidebar')"
      />
    </li>
  </ul>
</template>
