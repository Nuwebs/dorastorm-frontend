import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#imports";
import useAuthStore from "~/stores/authStore";
import { DsRouteMeta } from "~/types/dorastorm";
export default defineNuxtRouteMiddleware((to: DsRouteMeta, from: DsRouteMeta) => {
  const authStore = useAuthStore();
  const lp = useNuxtApp().$localePath;
  if (authStore.isLoggedIn){
    return navigateTo(lp('/ds'));
  }
});