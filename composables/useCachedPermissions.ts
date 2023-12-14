import { computed, ComputedRef } from 'vue';
import useAuthStore from '~/stores/authStore';
import Permission from '~/utils/permissions';

type CachedPermissions = Partial<Record<Permission, ComputedRef<boolean>>>;

const useCachedPermissions = (
  permissions: Permission[],
  strict: boolean = false
) => {
  const {
    hasAnyPermission,
    hasEveryPermissions,
    hasPermission,
    getUserRoleHierarchy
  } = useAuthStore();

  const cached: CachedPermissions = {};

  for (const permission of permissions) {
    cached[permission] = computed<boolean>(() => {
      return hasPermission(permission);
    });
  }

  function userCan (permission: Permission): boolean {
    const cPermission = cached[permission];
    if (cPermission !== undefined) {
      return cPermission.value;
    }
    // eslint-disable-next-line no-console
    console.error(
      `The permission ${permission} isn't cached. Make sure you are passing the right permission as parameter or you cached the correct permisisons.`
    );
    return false;
  }

  function roleCan (
    hierarchyNeeded: number,
    selfIncluded: boolean = false
  ): boolean {
    if (getUserRoleHierarchy === null) { return false; }
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
    userIsAllowed
  };
};

export default useCachedPermissions;
