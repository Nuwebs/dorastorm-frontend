import { defineNuxtRouteMiddleware } from '#imports';
import ExpiredTokenException from '~/exceptions/ExpiredTokenException';
import InvalidTokenException from '~/exceptions/InvalidTokenException';
import { isTokenExpired } from '~/services/auth-service';
import useAuthStore from '~/stores/auth-store';
import useExternalToastStore from '~/stores/external-toast-store';

export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) return;

  const authStore = useAuthStore();
  if (!authStore.isAppBooted) {
    authStore.loadUserData();
    authStore.isAppBooted = true;
  }

  if (!authStore.isLoggedIn) return;

  if (isTokenExpired(authStore.expiresEpoch)) {
    if (!(await tryRefreshToken(authStore.refreshToken))) return;
  }
});

async function tryRefreshToken(
  refreshTokenCallback: () => Promise<void>
): Promise<boolean> {
  try {
    await refreshTokenCallback();
    return true;
  } catch (error: unknown) {
    const toastStore = useExternalToastStore();
    if (error instanceof ExpiredTokenException) {
      toastStore.addToast({
        severity: 'error',
        detail: 'error.409.session_expired',
        life: 6000
      });
    }
    if (error instanceof InvalidTokenException) {
      toastStore.addToast({
        severity: 'error',
        detail: 'error.invalid_token',
        life: 6000
      });
    }
    return false;
  }
}
