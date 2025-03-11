<script setup>
import {
  UiNavigationMenu,
  UiNavigationMenuViewport,
  UiNavigationMenuList,
  UiNavigationMenuIndicator
} from '~/components/ui/navigation-menu';
</script>

<template>
  <UiNavigationMenu class="z-10">
    <UiNavigationMenuList
      class="header-section px-4 gap-4 items-center border-b border-gray-500"
    >
      <slot />
      <div class="ml-auto" />
      <slot name="end" />
    </UiNavigationMenuList>
    <UiNavigationMenuIndicator />
    <UiNavigationMenuViewport />
  </UiNavigationMenu>
</template>
