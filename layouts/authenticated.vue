<script setup lang="ts">
import { ref } from 'vue';
import TheAuthenticatedNavbar from '~/components/TheAuthenticatedNavbar.vue';
import TheAuthenticatedSidebar from '~/components/TheAuthenticatedSidebar.vue';

const collapsed = ref<boolean>(false);
</script>

<template>
  <main class="flex h-screen">
    <TheAuthenticatedSidebar :is-sidebar-collapsed="collapsed" />
    <section class="flex-1 flex flex-col" role="main">
      <TheAuthenticatedNavbar />

      <section class="flex-1 p-2">
        <slot />
      </section>
    </section>
  </main>
</template>

<style scoped></style>
