<template>
  <component :is="template">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import useAuthStore from '~/stores/authStore';
import Guest from "./guest.vue";
import { useRoute } from 'nuxt/app';

const authStore = useAuthStore();
const router = useRoute();
const regex = /^(\/([a-z0-9]{2}))?\/ds(\/\w+)*\/?$/;

const template = computed(() => {
  return authStore.isLoggedIn && regex.test(router.fullPath) 
    ? defineAsyncComponent(() => import('./ds.vue'))
    : Guest;
});
</script>