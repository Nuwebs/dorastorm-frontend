<script setup lang="ts">
import TheAuthenticatedNavbar from '~/components/TheAuthenticatedNavbar.vue';
import TheAuthenticatedSidebar from '~/components/TheAuthenticatedSidebar.vue';
import TheAuthenticatedMobileBar from '~/components/TheAuthenticatedMobileBar.vue';
import useWindowWidth from '~/composables/useWindowWidth';
import type { DsMenuItem } from '~/types/menu';

const MOBILE_BP: number = 992;
const { width } = useWindowWidth();

const testMenu: DsMenuItem[] = [
  {
    label: 'Dashboard',
    to: '/home',
    icon: 'pi pi-home'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    items: [
      { label: 'Test', to: '/test', icon: 'pi pi-user' },
      { label: 'Level 3', icon: 'pi pi-key', items: [{ label: 'Last' }] }
    ]
  },
  {
    label: 'Settings 2',
    icon: 'pi pi-cog',
    items: [
      { label: 'Test', to: '/test', icon: 'pi pi-user' },
      { label: 'Level 3', icon: 'pi pi-key', items: [{ label: 'Last' }] }
    ]
  },
  {
    label: 'Settings 3',
    icon: 'pi pi-cog',
    items: [
      { label: 'Test', to: '/test', icon: 'pi pi-user' },
      { label: 'Level 3', icon: 'pi pi-key', items: [{ label: 'Last' }] }
    ]
  },
  {
    label: 'Settings 4',
    icon: 'pi pi-cog',
    items: [
      { label: 'Test', to: '/test', icon: 'pi pi-user' },
      { label: 'Level 3', icon: 'pi pi-key', items: [{ label: 'Last' }] }
    ]
  },
  {
    label: 'Settings 5',
    icon: 'pi pi-cog',
    items: [
      { label: 'Test', to: '/test', icon: 'pi pi-user' },
      { label: 'Level 3', icon: 'pi pi-key', items: [{ label: 'Last' }] }
    ]
  }
];
</script>

<template>
  <main class="flex h-screen w-screen">
    <TheAuthenticatedSidebar v-if="width >= MOBILE_BP" :menu="testMenu" />
    <section class="flex-1 flex flex-col max-w-full" role="main">
      <TheAuthenticatedNavbar />

      <section class="flex-1 p-2 overflow-y-auto">
        <slot />
      </section>

      <TheAuthenticatedMobileBar
        v-if="width < MOBILE_BP"
        :menu="testMenu"
        class="w-full overflow-x-auto"
      />
    </section>
  </main>
</template>

<style scoped></style>
