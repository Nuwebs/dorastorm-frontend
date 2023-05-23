import { defineNuxtRouteMiddleware, useNuxtApp, useValidationLocales } from "#imports";
import { isTokenExpired, loadUserData, refreshToken } from "~/services/auth";
import useAuthStore from "~/stores/authStore";
import useComposablesToastStore from "~/stores/composablesToastStore";
import ExpiredTokenException from "~/utils/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/utils/exceptions/InvalidTokenException";
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return;
  const authStore = useAuthStore();
  if (!authStore.appBooted) {
    loadUserData();
    const currentLocale = useNuxtApp().$i18n.locale.value;
    useValidationLocales(currentLocale);
  }
  if (!(authStore.isLoggedIn && isTokenExpired(authStore.expiresEpoch))) return;
  try {
    // Here something should be triggered to let the user know the app is loading.
    await refreshToken();
  } catch (error: any) {
    const composablesToastStore = useComposablesToastStore();
    if (error instanceof ExpiredTokenException) {
      composablesToastStore.addToast({
        severity: "error",
        detail: "error.409.session_expired",
        life: 6000
      });
    }
    if (error instanceof InvalidTokenException) {
      composablesToastStore.addToast({
        severity: "error",
        detail: "error.invalid_token",
        life: 6000
      });
    }
  }
});
