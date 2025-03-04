<script setup lang="ts">
import NavbarMenuItem from '../NavbarMenuItem.vue';
import type { DsMenuItem } from '~/types/menu';

interface Props {
  options: DsMenuItem;
}

defineProps<Props>();
</script>
<template>
  <NavbarMenuItem :item="options" />
</template>
