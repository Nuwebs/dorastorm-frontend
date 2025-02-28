import { ref, computed } from 'vue';
import { defineStore } from '#imports';
import ExpiredTokenException from '~/exceptions/ExpiredTokenException';
import InvalidTokenException from '~/exceptions/InvalidTokenException';
import * as AuthService from '~/services/auth-service';
import {
  areAllPermissionsInArray,
  isAnyPermissionInArray,
  isPermissionInArray,
  type Permission
} from '~/services/permission-service';
import type { DefaultLoginCredentials, JWTResponse } from '~/types/auth';
import type { LaravelErrorBag } from '~/types/dorastorm';
import type { User } from '~/types/user';
import apiFetch from '~/utils/api-fetch';

const useAuthStore = defineStore('authStore', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const expiresEpoch = ref<number>(-1);
  const isAppBooted = ref<boolean>(false);

  const isLoggedIn = computed<boolean>(() => user.value !== null);
  const getPermissions = computed<Permission[]>(
    () => user.value?.role.permissions ?? []
  );
  const getUserRoleHierarchy = computed<number | null>(
    () => user.value?.role.hierarchy ?? null
  );

  function hasPermission(permission: Permission): boolean {
    return isPermissionInArray(permission, getPermissions.value);
  }

  function hasAnyPermission(permissions: Permission[]): boolean {
    return isAnyPermissionInArray(permissions, getPermissions.value);
  }

  function hasAllPermissions(permissions: Permission[]): boolean {
    return areAllPermissionsInArray(permissions, getPermissions.value);
  }

  function setAuthData(accessToken: string, noSave?: boolean): void {
    token.value = accessToken;
    const decoded = AuthService.decodeToken(accessToken);
    user.value = decoded.user;
    expiresEpoch.value = decoded.exp;
    if (!noSave) {
      // exp - iat = X seconds. It is multiplied by 2 to let the cookie stay longer
      AuthService.saveToken(accessToken, (decoded.exp - decoded.iat) * 2);
    }
  }

  async function refreshToken(): Promise<void> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.REFRESH
    });
    if (error) {
      $reset();
      if (error.statusCode === 409) throw new ExpiredTokenException('');
      throw new InvalidTokenException('');
    }
    setAuthData(data!.accessToken);
  }

  async function refreshIfValid(): Promise<boolean> {
    if (!token.value || AuthService.isTokenExpired(expiresEpoch.value))
      return false;
    try {
      await refreshToken();
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  async function login(
    credentials: DefaultLoginCredentials
  ): Promise<boolean | LaravelErrorBag> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGIN,
      noAuth: true,
      options: { method: 'post', body: credentials }
    });

    if (error) return error;
    setAuthData(data!.accessToken);
    return true;
  }

  async function logout(
    fastCall: boolean = false
  ): Promise<void | LaravelErrorBag> {
    if (fastCall) return $reset();

    const { error } = await apiFetch<void, LaravelErrorBag>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGOUT,
      options: { method: 'post' }
    });

    $reset();
    return error ?? undefined;
  }

  function loadUserData(): boolean {
    const lsToken = AuthService.getToken();
    if (!lsToken) return false;
    setAuthData(lsToken, true);
    return true;
  }

  function $reset(): void {
    user.value = null;
    token.value = null;
    expiresEpoch.value = -1;
    AuthService.cleanSavedKeys();
  }

  return {
    user,
    token,
    expiresEpoch,
    isAppBooted,
    isLoggedIn,
    getPermissions,
    getUserRoleHierarchy,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshToken,
    refreshIfValid,
    login,
    logout,
    loadUserData
  };
});

export default useAuthStore;
