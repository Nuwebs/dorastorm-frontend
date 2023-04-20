import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { User } from "~/types/dorastorm";

const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const expiresEpoch = ref<number>(-1);

  const isLoggedIn = computed<boolean>(() => {
    return user.value === null ? false : true;
  });

  const getPermissions = computed<string[] | null>(() => {
    if (!isLoggedIn) return null;
    return user.value!.role.permissions;
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

  return {
    user,
    token,
    expiresEpoch,
    isLoggedIn,
    getPermissions,
    hasPermission,
    hasAnyPermission,
  };
});

export default useAuthStore;
