import { FilterMatchModeOptions } from "primevue/api";
import { MenuItem } from "primevue/menuitem";
import { RouteLocationNormalized } from "vue-router";
export interface Role {
  id: number;
  hierarchy: number;
  name: string;
  description: string;
  permissions: string[];
  created: string;
  modified: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: Role;
}

export interface DsLoginCredentials {
  email: string,
  password: string
}

export interface DsRouteMeta extends RouteLocationNormalized {
  meta: RouteLocationNormalized["meta"] & {
    strictPermissions?: boolean;
    permissions?: string[];
  };
}

export type DsMenuItem = MenuItem & {
  permissions?: string | string[],
  items?: DsMenuItem | undefined
}

// Error related
export interface DsErrorBag {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}


// DataTable
export type DataTableColumn = {
  fieldName: string;
  header: string;
  sortable?: boolean;
}

export type Filter = {
  value: any | null;
  matchMode: FilterMatchModeOptions
}