import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { isTokenExpired, loadUserData, refreshToken } from "~/services/auth";
import useAuthStore from "~/stores/authStore";
import ExpiredTokenException from "~/utils/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/utils/exceptions/InvalidTokenException";
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  const authStore = useAuthStore();
  if (!authStore.appBooted) loadUserData();
  if (!(authStore.isLoggedIn && isTokenExpired(authStore.expiresEpoch))) return;
  try {
    // Here something should be triggered to let the user know the app is loading.
    await refreshToken();
  } catch (error: any) {
    // This error handling needs to be changed when the UI is implemented
    if (error instanceof ExpiredTokenException) {
      console.log("Token expirado");
    }
    if (error instanceof InvalidTokenException) {
      console.log("Token inválido");
    }
  }
});
