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

  const isLoggedIn = computed<boolean>(() => {
    return user.value !== null;
  });

  const getPermissions = computed<string[] | null>(() => {
    if (!user.value) return null;
    return user.value.role.permissions;
  });

  const getUserRoleHierarchy = computed<number | null>(() => {
    if (!user.value) return null;
    return user.value.role.hierarchy;
  });

  function hasPermission(permission: Permission): boolean {
    if (!user.value) return false;
    return isPermissionInArray(permission, user.value.role.permissions);
  }

  function hasAnyPermission(permissions: Permission[]): boolean {
    if (!user.value) return false;
    return isAnyPermissionInArray(permissions, user.value.role.permissions);
  }

  function hasAllPermissions(permissions: Permission[]): boolean {
    if (!user.value) return false;
    return areAllPermissionsInArray(permissions, user.value.role.permissions);
  }

  /** Refreshes the JWT token and updates localStorage. */
  async function refreshToken(): Promise<void> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.REFRESH
    });
    if (error) {
      AuthService.cleanSavedKeys();
      $reset();
      if (error.statusCode && error.statusCode === 409) {
        throw new ExpiredTokenException('');
      }
      throw new InvalidTokenException('');
    }
    token.value = data!.accessToken;
    user.value = AuthService.decodeToken(token.value).user;
    expiresEpoch.value = AuthService.calculateExpireEpoch(data!.expiresIn);
    AuthService.saveToken(token.value);
    AuthService.saveExpiresEpoch(expiresEpoch.value);
  }

  async function login(credentials: DefaultLoginCredentials): Promise<boolean> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGIN,
      auth: false,
      options: { method: 'post', body: credentials }
    });

    if (error) {
      console.error('There was an error trying to log in.');
      return false;
    }

    token.value = data!.accessToken;
    user.value = AuthService.decodeToken(token.value).user;
    expiresEpoch.value = AuthService.calculateExpireEpoch(data!.expiresIn);
    AuthService.saveToken(token.value);
    AuthService.saveExpiresEpoch(expiresEpoch.value);

    return true;
  }

  function resetAndClean(): void {
    $reset();
    AuthService.cleanSavedKeys();
  }

  /** Logs out the user, optionally skipping backend notification. */
  async function logout(
    fastCall: boolean = false
  ): Promise<void | LaravelErrorBag> {
    if (fastCall) return resetAndClean();

    const { error } = await apiFetch<void, LaravelErrorBag>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGOUT,
      options: { method: 'post' }
    });

    resetAndClean();
    if (error) return error;
  }

  function loadUserData() {
    const lsToken = localStorage.getItem('ds-jwt');
    const lsExpiresEpoch = localStorage.getItem('expiresEpoch');
    if (lsToken && lsExpiresEpoch) {
      token.value = lsToken;
      user.value = AuthService.decodeToken(token.value).user;
      expiresEpoch.value = Number(lsExpiresEpoch);
      return true;
    }
    return false;
  }

  function $reset(): void {
    user.value = null;
    token.value = null;
    expiresEpoch.value = -1;
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
    login,
    logout,
    loadUserData
  };
});

export default useAuthStore;
