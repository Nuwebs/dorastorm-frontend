<template>
  <section class="container">
    <Card v-if="authStore.user" class="shadow-1 mb-3">
      <template #title>
        {{ $t("general.welcome") }}
      </template>
      <template #content>
        <UserDataRow :user="authStore.user" />
      </template>
    </Card>
    <Card class="shadow-1 h-15rem">
      <template #title>
        Custom card
      </template>
      <template #content>
        <p>Your custom information system content!</p>
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import { definePageMeta } from '#imports';
import UserDataRow from '~/components/user/UserDataRow.vue';
import useAuthStore from '~/stores/authStore';

definePageMeta({
  middleware: ['auth-guard']
});

const authStore = useAuthStore();
</script>
