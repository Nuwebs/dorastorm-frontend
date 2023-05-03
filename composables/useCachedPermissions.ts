import { computed, ComputedRef } from "vue";
import useAuthStore from "~/stores/authStore";

interface CachedPermissions {
  [key: string]: ComputedRef<boolean>;
}

const useCachedPermissions = (
  permissions: string[],
  strict: boolean = false
) => {
  const { hasAnyPermission, hasEveryPermissions, hasPermission } =
    useAuthStore();

  const cached: CachedPermissions = {};

  for (let permission of permissions) {
    cached[permission] = computed<boolean>(() => {
      return hasPermission(permission);
    });
  }

  function userCan(permission: string) {
    return cached[permission];
  }

  const userIsAllowed = computed<boolean>(() => {
    return strict
      ? hasEveryPermissions(permissions)
      : hasAnyPermission(permissions);
  });

  return {
    userCan,
    userIsAllowed,
  };
};

export default useCachedPermissions;
