import {
  defineNuxtRouteMiddleware,
  navigateTo,
  setPageLayout,
  useNuxtApp
} from '#imports';
import useAuthStore from '~/stores/auth-store';
import type { DsRouteMeta } from '~/types/dorastorm';

export default defineNuxtRouteMiddleware((to: DsRouteMeta, _: DsRouteMeta) => {
  const authStore = useAuthStore();
  const lp = useNuxtApp().$localePath;
  if (!authStore.isLoggedIn) {
    return navigateTo(lp('/'));
  }
  if (!to.meta.layout) {
    setPageLayout('logged-in');
  }
  if (!to.meta.permissions) {
    return;
  }
  if (
    to.meta.bailSelf &&
    authStore.user &&
    authStore.user.id === Number(to.params.id)
  ) {
    return;
  }
  const checker = to.meta.strictPermissions
    ? authStore.hasEveryPermissions
    : authStore.hasAnyPermission;
  if (!checker(to.meta.permissions)) {
    return navigateTo(lp('/home'));
  }
});
