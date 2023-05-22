import { defineNuxtRouteMiddleware, navigateTo, setPageLayout, useMiddlewareLocalePath } from "#imports";
import useAuthStore from "~/stores/authStore";
import { DsRouteMeta } from "~/types/dorastorm";
export default defineNuxtRouteMiddleware(
  (to: DsRouteMeta, from: DsRouteMeta) => {    
    const authStore = useAuthStore();
    const lp = useMiddlewareLocalePath(to.name? to.name as string : "");
    if (!authStore.isLoggedIn) return navigateTo(lp("/login"));
    if (!to.meta.layout) setPageLayout("ds");
    if (!to.meta.permissions) return;
    const checker = to.meta.strictPermissions
      ? authStore.hasEveryPermissions
      : authStore.hasAnyPermission;
    if (!checker(to.meta.permissions)) return navigateTo(lp("/ds"));
  }
);
