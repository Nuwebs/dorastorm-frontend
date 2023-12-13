<template>
  <TheNavbar></TheNavbar>
  <main>
    <slot></slot>
  </main>
</template>
<script setup lang="ts">
import TheNavbar from '~/components/TheNavbar.vue';
</script>