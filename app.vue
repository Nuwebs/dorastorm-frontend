<template>
    <DefaultLayout>
      <NuxtPage></NuxtPage>
    </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from "~/layouts/default.vue";
import {loadUserData} from "~/services/auth";
import ExpiredTokenException from "./utils/exceptions/ExpiredTokenException";
import InvalidTokenException from "./utils/exceptions/InvalidTokenException";

if (process.client) {
  try {
    loadUserData();
  } catch (error: any) {
    // This error handling needs to be changed when the UI is implemented
    if (error instanceof ExpiredTokenException) {
      console.log('Token expirado');
    }
    if (error instanceof InvalidTokenException) {
      console.log('Token inválido');
    }
  }
}
</script>
