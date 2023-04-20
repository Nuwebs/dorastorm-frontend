import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import useAuthStore from "~/stores/authStore";
import { DsRouteMeta } from "~/types";
export default defineNuxtRouteMiddleware((to: DsRouteMeta, from: DsRouteMeta) => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn){
    return navigateTo('/ds');
  }
});