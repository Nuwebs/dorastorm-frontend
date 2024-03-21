import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#imports';
import useAuthStore from '~/stores/authStore';
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const lp = useNuxtApp().$localePath;
  if (authStore.isLoggedIn) {
    return navigateTo(lp('/ds'));
  }
});
