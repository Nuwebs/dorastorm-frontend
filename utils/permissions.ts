import { RolePermissionGroup } from "~/types/dorastorm";

const PERMISSIONS = {
  USERS_CREATE: "users-create",
  USERS_READ: "users-read",
  USERS_UPDATE: "users-update",
  USERS_DELETE: "users-delete",

  POSTS_CREATE: "posts-create",
  POSTS_READ: "posts-read",
  POSTS_UPDATE: "posts-update",
  POSTS_DELETE: "posts-delete",

  ROLES_CREATE: "roles-create",
  ROLES_READ: "roles-read",
  ROLES_UPDATE: "roles-update",
  ROLES_DELETE: "roles-delete",

  QUOTATIONS_READ: "quotations-read",
  QUOTATIONS_DELETE: "quotations-delete",

  PROFILE_READ: "profile-read",
  PROFILE_UPDATE: "profile-update",
};

export function getPermissionsGroups(permissions: string[]) {
  return permissions.reduce((acc: RolePermissionGroup[], permission: string) => {
    const module = permission.split("-")[0];
    const existingModule = acc.find((m: RolePermissionGroup) => m.module === module);

    if (existingModule) {
      existingModule.permissions.push(permission);
    } else {
      acc.push({
        module,
        permissions: [permission],
      });
    }
    return acc;
  }, []);
}

export default PERMISSIONS;