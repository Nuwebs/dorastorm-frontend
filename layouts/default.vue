<template>
  <component :is="template">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import useAuthStore from '~/stores/authStore';
import Guest from "./guest.vue";

const authStore = useAuthStore();

const template = computed(() => {
  return authStore.isLoggedIn ? defineAsyncComponent(() => import('./ds.vue')) : Guest;
});
</script>