export const PERMISSION = {
  USERS_CREATE: 'users-create',
  USERS_READ: 'users-read',
  USERS_UPDATE: 'users-update',
  USERS_DELETE: 'users-delete',

  ROLES_CREATE: 'roles-create',
  ROLES_READ: 'roles-read',
  ROLES_UPDATE: 'roles-update',
  ROLES_DELETE: 'roles-delete'
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

/**
 * Returns true if the Permission is included in the permissions array
 * @param permissionToCheck
 * @param permissionsArray
 * @returns
 */
export function isPermissionInArray(
  permissionToCheck: Permission,
  permissionsArray: Permission[]
): boolean {
  return permissionsArray.includes(permissionToCheck);
}

/**
 * Returns true if ar least one permission inside permissions to check is included the permissions array
 * @param permissionsToCheck
 * @param permissionsArray
 * @returns
 */
export function isAnyPermissionInArray(
  permissionsToCheck: Permission[],
  permissionsArray: Permission[]
): boolean {
  return permissionsArray.some((permission) =>
    permissionsToCheck.includes(permission)
  );
}

/**
 * Returns true if all permissions inside the permissions to check array are included in the permissions array
 * @param permissionsToCheck
 * @param permissionsArray
 * @returns
 */
export function areAllPermissionsInArray(
  permissionsToCheck: Permission[],
  permissionsArray: Permission[]
): boolean {
  for (const permission of permissionsToCheck) {
    if (!isPermissionInArray(permission, permissionsArray)) {
      return false;
    }
  }
  return true;
}
