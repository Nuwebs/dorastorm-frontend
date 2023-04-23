<template>
  <Button 
    text
    plain
    icon="pi pi-sign-out"
    rounded
    @click="signOut"
    aria-label="Sign out"
  />
</template>

<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { logout } from '~/services/auth';
import Button from "primevue/button";

async function signOut() {
  await logout();
  navigateTo('/');
}
</script>