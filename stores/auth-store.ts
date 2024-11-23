// import { getUserInfo } from "~/services/auth-service";
import ExpiredTokenException from "~/exceptions/ExpiredTokenException";
import InvalidTokenException from "~/exceptions/InvalidTokenException";
import * as AuthService from "~/services/auth-service";
import type { Permission } from "~/services/permission-service";
import type { DefaultLoginCredentials, JWTResponse } from "~/types/auth";
import type { LaravelErrorBag } from "~/types/dorastorm";
import type { User } from "~/types/user";

const useAuthStore = defineStore("authStore", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const expiresEpoch = ref<number>(-1);
  const isAppBooted = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const isUserRefreshed = ref<boolean>(false);

  const isLoggedIn = computed<boolean>(() => {
    return user.value !== null;
  });

  const getPermissions = computed<string[] | null>(() => {
    if (!user.value) {
      return null;
    }
    return user.value.role.permissions;
  });

  const getUserRoleHierarchy = computed<number | null>(() => {
    if (!user.value) {
      return null;
    }
    return user.value.role.hierarchy;
  });

  function hasPermission(permission: Permission): boolean {
    if (!user.value) {
      return false;
    }
    return user.value.role.permissions.includes(permission);
  }

  function hasAnyPermission(permissions: Permission[]): boolean {
    if (!user.value) {
      return false;
    }
    return user.value.role.permissions.some((permission) =>
      permissions.includes(permission)
    );
  }

  function hasEveryPermissions(permissions: Permission[]): boolean {
    if (!user.value) {
      return false;
    }
    for (const permission of permissions) {
      if (!hasPermission(permission)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Refreshes the DS JWT token and updates localStorage with new values.
   * Throws exceptions if the token refresh fails.
   */
  async function refreshToken(): Promise<void> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.REFRESH,
    });
    if (error) {
      AuthService.cleanSavedKeys();
      $reset();
      if (error.statusCode && error.statusCode === 409) {
        throw new ExpiredTokenException("");
      }
      throw new InvalidTokenException("");
    }
    token.value = data!.accessToken;
    expiresEpoch.value = AuthService.calculateExpireEpoch(data!.expiresIn);
    AuthService.saveToken(token.value);
    AuthService.saveExpiresEpoch(expiresEpoch.value);
  }

  /**
   * Retrieves user information from the server and updates the auth store.
   */
  async function getUserInfo(): Promise<void | LaravelErrorBag> {
    const { data, error } = await apiFetch<User, LaravelErrorBag>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGGED_USER_INFO,
    });
    if (error) {
      return error;
    }

    user.value = data!;
    AuthService.saveUser(user.value);
  }

  /**
   * Logs in a user with provided credentials and updates the auth store.
   */
  async function login(credentials: DefaultLoginCredentials): Promise<boolean> {
    const { data, error } = await apiFetch<JWTResponse>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGIN,
      auth: false,
      options: {
        method: "post",
        body: credentials,
      },
    });
    if (error) {
      return false;
    }
    token.value = data!.accessToken;

    const failed = await getUserInfo();
    if (failed) {
      return false;
    }

    expiresEpoch.value = AuthService.calculateExpireEpoch(data!.expiresIn);
    AuthService.saveToken(token.value);
    AuthService.saveExpiresEpoch(expiresEpoch.value);

    return true;
  }

  function resetAndClean(): void {
    $reset();
    AuthService.cleanSavedKeys();
  }

  /**
   * Logs out a user and clears authentication data. If the fastCall param is sent
   * it removes the token from the app but does not inform the backend.
   */
  async function logout(
    fastCall: boolean = false
  ): Promise<void | LaravelErrorBag> {
    if (fastCall) return resetAndClean();

    const { error } = await apiFetch<void, LaravelErrorBag>({
      endpoint: AuthService.AUTH_ENDPOINT.LOGOUT,
      options: {
        method: "post",
      },
    });

    resetAndClean();

    if (error) {
      return error;
    }
  }

  /**
   * Loads user data from localStorage into the auth store.
   */
  function loadUserData(): void {
    isAppBooted.value = true;
    const lsToken = AuthService.isPotentiallyLoggedIn();
    if (lsToken === false) {
      return AuthService.cleanSavedKeys();
    }
    const lsUser = AuthService.getUserData();
    if (lsUser === false) {
      return AuthService.cleanSavedKeys();
    }

    const lsExpiresEpoch = AuthService.getExpiresEpoch();

    token.value = lsToken as string;
    user.value = lsUser as User;
    expiresEpoch.value = lsExpiresEpoch;
  }

  async function refreshUserData(): Promise<void> {
    if (isUpdating.value) {
      return;
    }
    isUpdating.value = true;
    isUserRefreshed.value = true;
    await getUserInfo();
    isUpdating.value = false;
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
    isUserRefreshed,

    getPermissions,
    getUserRoleHierarchy,
    hasPermission,
    hasAnyPermission,
    hasEveryPermissions,

    refreshUserData,

    refreshToken,
    login,
    logout,
    loadUserData,
  };
});

export default useAuthStore;
