<template>
  <section>
    <h1>Home page for logged users</h1>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
// This page shouldn't have any permission due to be the base logged in
// users page.
definePageMeta({
  middleware: ['auth-guard']
});
</script>