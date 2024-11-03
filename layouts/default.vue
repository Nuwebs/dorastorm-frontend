<script setup lang="ts">
/**
 * This layout is meant to be used for Guests (non authenticated users)
 */
</script>

<template>
  <TheGuestNavbar></TheGuestNavbar>
  <main>
    <slot></slot>
  </main>
</template>

<style scoped></style>
