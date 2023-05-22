import { defineNuxtRouteMiddleware, navigateTo, useMiddlewareLocalePath } from "#imports";
import useAuthStore from "~/stores/authStore";
import { DsRouteMeta } from "~/types/dorastorm";
export default defineNuxtRouteMiddleware((to: DsRouteMeta, from: DsRouteMeta) => {
  const authStore = useAuthStore();
  const lp = useMiddlewareLocalePath(to.name? to.name as string : "");
  if (authStore.isLoggedIn){
    return navigateTo(lp('/ds'));
  }
});