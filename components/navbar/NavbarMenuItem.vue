<script setup lang="ts">
import { NavigationMenuSub } from 'reka-ui';
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
        <component
          :is="item.icon"
          v-if="item.icon"
          :class="{ 'mr-2': label }"
        />
        {{ label }}
      </UiNavigationMenuTrigger>
      <UiNavigationMenuContent>
        <NavigationMenuSub>
          <UiNavigationMenuList class="flex-col gap-2">
            <NavbarMenuItem
              v-for="(subItem, index) in item.items"
              :key="`${index}-${subItem.label}`"
              :item="subItem"
            />
          </UiNavigationMenuList>
        </NavigationMenuSub>
      </UiNavigationMenuContent>
    </template>
    <template v-else>
      <UiNavigationMenuLink
        v-if="item.to || item.url || item.command"
        class="px-1 flex items-center"
      >
        <component :is="item.icon" v-if="item.icon" class="mr-2" />
        <NuxtLinkLocale v-if="item.to" :to="item.to">
          {{ label }}
        </NuxtLinkLocale>
        <a
          v-else-if="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ label }}
        </a>
        <span
          v-else
          class="cursor-pointer"
          @click="item.command ? item.command() : null"
          >{{ label }}</span
        >
      </UiNavigationMenuLink>
    </template>
  </UiNavigationMenuItem>
</template>

<style scoped></style>
