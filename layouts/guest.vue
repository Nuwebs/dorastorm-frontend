<template>
  <TheNavbar></TheNavbar>
  <article>
    <slot></slot>
  </article>
</template>
<script setup lang="ts">
import TheNavbar from '~/components/TheNavbar.vue';
</script>