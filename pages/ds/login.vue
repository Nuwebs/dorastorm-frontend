<template>
  <section>
    <form @submit.prevent="submit">
      <label for="email">Email:</label>
      <input type="email" required v-model="credentials.email">
      <label for="password">Password:</label>
      <input type="password" required v-model="credentials.password">
      <input type="submit">
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, navigateTo } from '#imports';
import { login } from '~/services/auth';
import { DsLoginCredentials } from '~/types/dorastorm';

definePageMeta({
  middleware: ['guest-guard']
});

const credentials = ref<DsLoginCredentials>({
  email: '',
  password: ''
});

async function submit(): Promise<void> {
  const response = await login(credentials.value);
  if (response) {
    console.log(response.data);
    return;
  }
  navigateTo('/ds');
}

</script>