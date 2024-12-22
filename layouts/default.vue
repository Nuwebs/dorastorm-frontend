<script setup lang="ts">
/**
 * This layout is meant to be used for Guests (non authenticated users)
 */
</script>

<template>
  <main>
    <header>
      <TheGuestNavbar />
    </header>

    <section role="main">
      <slot />
    </section>
  </main>
</template>

<style scoped></style>
