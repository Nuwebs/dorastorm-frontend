import { defineNuxtRouteMiddleware } from '#imports';
import ExpiredTokenException from '~/exceptions/ExpiredTokenException';
import InvalidTokenException from '~/exceptions/InvalidTokenException';
import { isTokenExpired } from '~/services/auth-service';
import useAuthStore from '~/stores/auth-store';
import useExternalToastStore from '~/stores/external-toast-store';

/**
 * This middleware only works for SPA applications. DS4F is meant only for SPAs, so if you are
 * trying to do SSR, you may be looking for other middleware
 */
export default defineNuxtRouteMiddleware(async () => {
  // Checks if the process is executing in client-side
  if (!import.meta.client) {
    return;
  }

  const authStore = useAuthStore();
  // The app boot should only happen once
  if (!authStore.isAppBooted) {
    authStore.loadUserData();
  }

  // If the user isn't logged in the rest of the function isn't needed.
  if (!authStore.isLoggedIn) {
    return;
  }
  // If the token is expired it will be refreshed. If the session is sucessfully refreshed
  // the function continues. If not, finish the execution of the function.
  if (isTokenExpired(authStore.expiresEpoch)) {
    if (!(await tryRefreshToken(authStore.refreshToken))) {
      return;
    }
  }

  // The user data is refreshed one time when the app boots.
  // Remove or comment the following 3 lines of code if the app doesn't need to refresh the data
  if (!authStore.isUserRefreshed) {
    authStore.refreshUserData();
  }
});

// If the token could be refreshed returns true, false otherwise.
async function tryRefreshToken(
  refreshTokenCallback: () => Promise<void>
): Promise<boolean> {
  try {
    // Here something should be triggered to let the user know the app is loading.
    await refreshTokenCallback();
    return true;
  } catch (error: unknown) {
    const composablesToastStore = useExternalToastStore();
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
