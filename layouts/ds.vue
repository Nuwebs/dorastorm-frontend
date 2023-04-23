<template>
  <TheDSNavbar/>
  <article>
    <slot></slot>
  </article>
</template>

<script setup lang="ts">
import TheDSNavbar from '~/components/TheDSNavbar.vue';
</script>