<script setup lang="ts">
import type { DsMenuItem } from '~/types/menu';
import SidebarItem from './SidebarItem.vue';

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
    <li v-for="item in menu" :key="item.name">
      <SidebarItem
        :item="item"
        :collapsed="collapsed"
        @expand-sidebar="emit('expandSidebar')"
      />
    </li>
  </ul>
</template>
