import { defineNuxtRouteMiddleware, navigateTo, setPageLayout } from "nuxt/app";
import useAuthStore from "~/stores/authStore";
import { DsRouteMeta } from "~/types/dorastorm";
export default defineNuxtRouteMiddleware(
  (to: DsRouteMeta, from: DsRouteMeta) => {
    if (!to.meta.layout) setPageLayout("ds");    
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) return navigateTo("/login");
    if (!to.meta.permissions) return;
    const checker = to.meta.strictPermissions
      ? authStore.hasEveryPermissions
      : authStore.hasAnyPermission;
    if (!checker(to.meta.permissions)) return navigateTo("/ds");
  }
);
