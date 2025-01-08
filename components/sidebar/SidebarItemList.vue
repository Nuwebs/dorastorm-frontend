<script setup lang="ts">
import type { DsMenuItem } from '~/types/menu';
import SidebarItem from './SidebarItem.vue';

defineProps<{
  menu: DsMenuItem[];
  collapsed: boolean;
}>();
</script>

<template>
  <ul>
    <li v-for="item in menu" :key="item.name">
      <SidebarItem :item="item" :collapsed="collapsed" />
    </li>
  </ul>
</template>
