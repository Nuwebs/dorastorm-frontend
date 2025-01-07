import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#imports';
import useAuthStore from '~/stores/auth-store';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const lp = useNuxtApp().$localePath;
  if (authStore.isLoggedIn) {
    return navigateTo(lp('/home'));
  }
});
