import { getUserInfo } from "~/services/auth-service";
import type { Permission } from "~/services/permission-service";
import type { User } from "~/types/user";

const useAuthStore = defineStore("authStore", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const expiresEpoch = ref<number>(-1);
  const appBooted = ref<boolean>(false);
  const updating = ref<boolean>(false);
  const userRefreshed = ref<boolean>(false);

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

  async function refreshUserData(): Promise<void> {
    if (updating.value) {
      return;
    }
    updating.value = true;
    userRefreshed.value = true;
    await getUserInfo();
    updating.value = false;
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
    appBooted,
    isLoggedIn,
    getPermissions,
    getUserRoleHierarchy,
    hasPermission,
    hasAnyPermission,
    hasEveryPermissions,
    userRefreshed,
    refreshUserData,
    $reset,
  };
});

export default useAuthStore;
