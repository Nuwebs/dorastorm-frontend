import { computed, type ComputedRef } from 'vue';
import type { Permission } from '~/services/permission-service';
import useAuthStore from '~/stores/auth-store';

type CachedPermissions = Partial<Record<Permission, ComputedRef<boolean>>>;

export default function useCachedPermissions(
  permissions: Permission[],
  strict: boolean = false
) {
  const {
    hasAnyPermission,
    hasAllPermissions,
    hasPermission,
    getUserRoleHierarchy
  } = useAuthStore();

  const cached: CachedPermissions = {};

  for (const permission of permissions) {
    cached[permission] = computed<boolean>(() => {
      return hasPermission(permission);
    });
  }

  function userCan(permission: Permission): boolean {
    const cPermission = cached[permission];
    if (cPermission !== undefined) {
      return cPermission.value;
    }
    console.error(
      `The permission ${permission} isn't cached. Make sure you are passing the right permission as parameter or you cached the correct permisisons.`
    );
    return false;
  }

  function roleCan(
    hierarchyNeeded: number,
    selfIncluded: boolean = false
  ): boolean {
    if (getUserRoleHierarchy === null) {
      return false;
    }
    return selfIncluded
      ? getUserRoleHierarchy <= hierarchyNeeded
      : getUserRoleHierarchy < hierarchyNeeded;
  }

  const userIsAllowed = computed<boolean>(() => {
    return strict
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  });

  return {
    userCan,
    roleCan,
    userIsAllowed
  };
}
