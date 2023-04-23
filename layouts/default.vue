<template>
  <component :is="template">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import useAuthStore from '~/stores/authStore';

const authStore = useAuthStore();

const template = computed(() => {
  const DS = defineAsyncComponent(() => import('./ds.vue'));
  const Guest = defineAsyncComponent(() => import('./guest.vue'));
  return authStore.isLoggedIn ? DS : Guest;
});
</script>