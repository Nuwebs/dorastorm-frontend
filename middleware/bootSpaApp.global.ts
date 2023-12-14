import {
  defineNuxtRouteMiddleware,
  useNuxtApp,
  useValidationLocales
} from '#imports';
import { isTokenExpired, loadUserData, refreshToken } from '~/services/auth';
import useAuthStore from '~/stores/authStore';
import useComposablesToastStore from '~/stores/composablesToastStore';
import ExpiredTokenException from '~/utils/exceptions/ExpiredTokenException';
import InvalidTokenException from '~/utils/exceptions/InvalidTokenException';

// If the token could be refreshed returns true, false otherwise.
async function tryRefreshToken (): Promise<boolean> {
  try {
    // Here something should be triggered to let the user know the app is loading.
    await refreshToken();
    return true;
  } catch (error: any) {
    const composablesToastStore = useComposablesToastStore();
    if (error instanceof ExpiredTokenException) {
      composablesToastStore.addToast({
        severity: 'error',
        detail: 'error.409.session_expired',
        life: 6000
      });
    }
    if (error instanceof InvalidTokenException) {
      composablesToastStore.addToast({
        severity: 'error',
        detail: 'error.invalid_token',
        life: 6000
      });
    }
    return false;
  }
}

export default defineNuxtRouteMiddleware(async () => {
  if (!process.client) { return; }
  const authStore = useAuthStore();
  if (!authStore.appBooted) {
    loadUserData();
    const currentLocale = useNuxtApp().$i18n.locale.value;
    useValidationLocales(currentLocale);
  }

  // If the user isn't logged in the rest of the function isn't needed.
  if (!authStore.isLoggedIn) { return; }
  // If the token is expired it will be refreshed. If the session is sucessfully refreshed
  // the function continues. If not, finish the execution of the function.
  if (isTokenExpired(authStore.expiresEpoch)) {
    if (!(await tryRefreshToken())) { return; }
  }

  // The user data is refreshed one time when the app boots.
  // Remove or comment the following 3 lines of code if the app doesn't need to refresh the data
  if (!authStore.userRefreshed) {
    authStore.refreshUserData();
  }
});
