import { computed, ComputedRef } from "vue";
import useAuthStore from "~/stores/authStore";

interface CachedPermissions {
  [key: string]: ComputedRef<boolean>;
}

const useCachedPermissions = (
  permissions: string[],
  strict: boolean = false
) => {
  const {
    hasAnyPermission,
    hasEveryPermissions,
    hasPermission,
    getUserRoleHierarchy,
  } = useAuthStore();

  const cached: CachedPermissions = {};

  for (let permission of permissions) {
    cached[permission] = computed<boolean>(() => {
      return hasPermission(permission);
    });
  }

  function userCan(permission: string) {
    return cached[permission];
  }

  function roleCan(hierarchyNeeded: number, selfIncluded: boolean = false) {
    if (getUserRoleHierarchy === null) return false;
    return selfIncluded
      ? getUserRoleHierarchy <= hierarchyNeeded
      : getUserRoleHierarchy < hierarchyNeeded;
  }

  const userIsAllowed = computed<boolean>(() => {
    return strict
      ? hasEveryPermissions(permissions)
      : hasAnyPermission(permissions);
  });

  return {
    userCan,
    roleCan,
    userIsAllowed,
  };
};

export default useCachedPermissions;
