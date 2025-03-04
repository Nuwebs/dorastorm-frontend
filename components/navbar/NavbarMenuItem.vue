<script setup lang="ts">
import { computed } from 'vue';
import {
  UiNavigationMenuItem,
  UiNavigationMenuTrigger,
  UiNavigationMenuContent,
  UiNavigationMenuList,
  UiNavigationMenuLink
} from '../ui/navigation-menu';
import type { DsMenuItem } from '~/types/menu';

const props = defineProps<{
  item: DsMenuItem;
}>();

const label = computed<string>(() => {
  if (typeof props.item.label === 'function') {
    return props.item.label();
  }
  return props.item.label ?? '';
});
</script>

<template>
  <UiNavigationMenuItem>
    <!-- Case 1: Item has sub-items, render as a trigger with content -->
    <template v-if="item.items && item.items.length > 0">
      <UiNavigationMenuTrigger>
        <i v-if="item.icon" :class="item.icon" />
        {{ label }}
      </UiNavigationMenuTrigger>
      <UiNavigationMenuContent>
        <UiNavigationMenuList>
          <NavbarMenuItem
            v-for="(subItem, index) in item.items"
            :key="`${index}-${subItem.label}`"
            :item="subItem"
          />
        </UiNavigationMenuList>
      </UiNavigationMenuContent>
    </template>
    <template v-else>
      <UiNavigationMenuLink v-if="item.to || item.url">
        <i v-if="item.icon" :class="item.icon" />
        <NuxtLinkLocale v-if="item.to" :to="item.to">
          {{ label }}
        </NuxtLinkLocale>
        <a v-else :href="item.url" target="_blank" rel="noopener noreferrer">
          {{ label }}</a
        >
      </UiNavigationMenuLink>
    </template>
  </UiNavigationMenuItem>
</template>

<style scoped></style>
