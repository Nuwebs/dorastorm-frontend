<script setup lang="ts">
import NavbarMenuItem from './NavbarMenuItem.vue';
import UiNavigationMenu from '../ui/navigation-menu/UiNavigationMenu.vue';
import UiNavigationMenuItem from '../ui/navigation-menu/UiNavigationMenuItem.vue';
import UiNavigationMenuLink from '../ui/navigation-menu/UiNavigationMenuLink.vue';
import UiNavigationMenuList from '../ui/navigation-menu/UiNavigationMenuList.vue';
import type { DsMenuItem } from '~/types/menu';

defineProps<{
  content?: DsMenuItem[];
}>();
</script>

<template>
  <UiNavigationMenu
    class="header-section z-10 items-center px-4 border-b border-gray-500"
  >
    <div class="w-full">
      <UiNavigationMenuList>
        <slot name="start">
          <UiNavigationMenuItem>
            <UiNavigationMenuLink as="div" class="font-semibold mr-4">
              DS4F
            </UiNavigationMenuLink>
          </UiNavigationMenuItem>
        </slot>

        <NavbarMenuItem
          v-for="(item, index) in content"
          :key="`base-${index}-${item.label}`"
          :item="item"
        />
        <slot />

        <div class="ml-auto">
          <slot name="end" />
        </div>
      </UiNavigationMenuList>
    </div>
  </UiNavigationMenu>
</template>

<style scoped></style>
