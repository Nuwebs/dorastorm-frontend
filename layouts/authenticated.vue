<script setup lang="ts">
import TheAuthenticatedMobileBar from '~/components/TheAuthenticatedMobileBar.vue';
import TheAuthenticatedNavbar from '~/components/TheAuthenticatedNavbar.vue';
import TheAuthenticatedSidebar from '~/components/TheAuthenticatedSidebar.vue';
import useAuthenticatedMenu from '~/composables/useAuthenticatedMenu';

const { processed } = useAuthenticatedMenu();
</script>

<template>
  <main class="flex h-screen w-screen">
    <TheAuthenticatedSidebar :menu="processed" class="hidden md:flex" />
    <section class="flex-1 flex flex-col max-w-full" role="main">
      <TheAuthenticatedNavbar />

      <section class="flex-1 p-2 overflow-y-auto">
        <slot />
      </section>

      <TheAuthenticatedMobileBar
        :menu="processed"
        class="w-full overflow-x-auto"
      />
    </section>
  </main>
</template>

<style scoped></style>
