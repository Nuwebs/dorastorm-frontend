import { FilterMatchModeOptions } from 'primevue/api';
import { MenuItem } from 'primevue/menuitem';
import { RouteLocationNormalized } from 'vue-router';
import Permission from '~/utils/permissions';

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

export interface RolePermissionGroup {
  module: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: Role;
}

export interface NewQuotation {
  subject: string;
  phone: string;
  name: string;
  email: string;
  content: string;
}

export interface Quotation extends NewQuotation {
  id: number;
  created_at: string;
  modified_at: string;
}

export interface DsLoginCredentials {
  email: string;
  password: string;
}

export interface DsRouteMeta extends RouteLocationNormalized {
  meta: RouteLocationNormalized['meta'] & {
    strictPermissions?: boolean;
    permissions?: Permission[];
  };
}

export type DsMenuItem = MenuItem & {
  permissions?: Permission | Permission[];
  items?: DsMenuItem | undefined;
};

// Error related
export interface DsValidationErrorBag<T> {
  message: string;
  errors: Partial<Record<keyof T, string[]>>;
}

// DataTable
export type DataTableColumn = {
  fieldName: string;
  header: string;
  sortable?: boolean;
};

export type Filter<T> = {
  value: any | null;
  matchMode: FilterMatchModeOptions[keyof FilterMatchModeOptions];
  temp?: T;
};

export type DataTableFilter<T = any> = {
  [key: string]: Filter<T>;
};

export interface PaginationWrapper<DataT> {
  data: DataT[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
