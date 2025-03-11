import { defineNuxtRouteMiddleware } from '#imports';
import ExpiredTokenException from '~/exceptions/ExpiredTokenException';
import InvalidTokenException from '~/exceptions/InvalidTokenException';
import { isTokenExpired } from '~/services/auth-service';
import useAuthStore from '~/stores/auth-store';
import useExternalToastStore from '~/stores/external-toast-store';

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  if (!authStore.isAppBooted) {
    const hasToken = authStore.loadUserData();
    if (hasToken) {
      // Refresh token on app boot if it’s valid
      await authStore.refreshIfValid();
    }
    authStore.isAppBooted = true;
  }

  if (!authStore.isLoggedIn) return;

  // Refresh if token is about to expire (e.g., within 30 seconds)
  if (isTokenExpired(authStore.expiresEpoch - 30)) {
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
        variant: 'destructive',
        description: 'error.409.session_expired'
      });
    }
    if (error instanceof InvalidTokenException) {
      toastStore.addToast({
        variant: 'destructive',
        description: 'error.invalid_token'
      });
    }
    return false;
  }
}
