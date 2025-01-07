<script setup lang="ts">
import TheGuestNavbar from '~/components/TheGuestNavbar.vue';
/**
 * This layout is meant to be used for Guests (non authenticated users)
 */
</script>

<template>
  <main>
    <header>
      <TheGuestNavbar />
    </header>

    <section role="main" class="main-section">
      <slot />
    </section>
  </main>
</template>

<style scoped></style>
