import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { User } from "~/types/dorastorm";

const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const expiresEpoch = ref<number>(-1);
  const appBooted = ref<boolean>(false);

  const isLoggedIn = computed<boolean>(() => {
    return user.value === null ? false : true;
  });

  const getPermissions = computed<string[] | null>(() => {
    if (!user.value) return null;
    return user.value.role.permissions;
  });

  function hasPermission(permission: string): boolean {
    if (!isLoggedIn) return false;
    return user.value!.role.permissions.includes(permission);
  }

  function hasAnyPermission(permissions: string[]): boolean {
    if (!isLoggedIn) return false;
    return user.value!.role.permissions.some((permission) =>
      permissions.includes(permission)
    );
  }

  function hasEveryPermissions(permissions: string[]): boolean {
    if (!isLoggedIn) return false;
    for (const permission of permissions) {
      if (!hasPermission(permission)) return false;
    }
    return true;
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
    hasPermission,
    hasAnyPermission,
    hasEveryPermissions,
    $reset,
  };
});

export default useAuthStore;
