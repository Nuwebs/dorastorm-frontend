export const PERMISSION = {
  USERS_CREATE: "users-create",
  USERS_READ: "users-read",
  USERS_UPDATE: "users-update",
  USERS_DELETE: "users-delete",

  ROLES_CREATE: "roles-create",
  ROLES_READ: "roles-read",
  ROLES_UPDATE: "roles-update",
  ROLES_DELETE: "roles-delete",
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];
