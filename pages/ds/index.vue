<template>
  <section>
    <h1>Home page for logged users</h1>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, navigateTo } from '#imports';
import { logout } from '~/services/auth';
// This page shouldn't have any permission due to be the base logged in
// users page.
definePageMeta({
  middleware: ['auth-guard']
});

async function signout() {
  await logout();
  navigateTo('/');
}
</script>