import type { Permission } from "~/services/permission-service";

export interface NewRole {
  hierarchy: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Role extends NewRole {
  id: number;
  created_at: string;
  modified_at: string;
}
