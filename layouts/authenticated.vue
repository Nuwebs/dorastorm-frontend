<script setup lang="ts">
import TheAuthenticatedMobileBar from '~/components/TheAuthenticatedMobileBar.vue';
import TheAuthenticatedNavbar from '~/components/TheAuthenticatedNavbar.vue';
import TheAuthenticatedSidebar from '~/components/TheAuthenticatedSidebar.vue';
import useAuthenticatedMenu from '~/composables/useAuthenticatedMenu';
import useWindowWidth from '~/composables/useWindowWidth';

const MOBILE_BP: number = 992;
const { width } = useWindowWidth();
const { processed } = useAuthenticatedMenu();
</script>

<template>
  <main class="flex h-screen w-screen">
    <TheAuthenticatedSidebar v-if="width >= MOBILE_BP" :menu="processed" />
    <section class="flex-1 flex flex-col max-w-full" role="main">
      <TheAuthenticatedNavbar />

      <section class="flex-1 p-2 overflow-y-auto">
        <slot />
      </section>

      <TheAuthenticatedMobileBar
        v-if="width < MOBILE_BP"
        :menu="processed"
        class="w-full overflow-x-auto"
      />
    </section>
  </main>
</template>

<style scoped></style>
