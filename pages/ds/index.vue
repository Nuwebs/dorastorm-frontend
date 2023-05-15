<template>
  <section class="p-container">
    <Card class="shadow-1 mb-3" v-if="authStore.user">
      <template #title>
        {{ $t("general.welcome") }}
      </template>
      <template #content>
        <UserDataRow :user="authStore.user"></UserDataRow>
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
import { definePageMeta } from '#imports';
import Card from 'primevue/card';
import UserDataRow from '~/components/user/UserDataRow.vue';
import useAuthStore from '~/stores/authStore';

definePageMeta({
  middleware: ["auth-guard"]
});

const authStore = useAuthStore();
</script>