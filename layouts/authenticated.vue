<script setup lang="ts">
import TheAuthenticatedNavbar from '~/components/TheAuthenticatedNavbar.vue';
import TheAuthenticatedSidebar from '~/components/TheAuthenticatedSidebar.vue';
</script>

<template>
  <main class="flex h-screen">
    <TheAuthenticatedSidebar />
    <section class="flex-1 flex flex-col" role="main">
      <TheAuthenticatedNavbar />

      <section class="flex-1 p-2 overflow-y-auto">
        <slot />
      </section>
    </section>
  </main>
</template>

<style scoped></style>
