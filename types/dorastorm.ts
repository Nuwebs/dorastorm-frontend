import type { RouteLocationNormalized } from "vue-router";
import type { Permission } from "~/services/permission-service";

export interface DsRouteMeta extends RouteLocationNormalized {
  meta: RouteLocationNormalized["meta"] & {
    strictPermissions?: boolean;
    permissions?: Permission[];
  };
}

// Error related
export interface DsValidationErrorBag<T> {
  message: string;
  errors: Partial<Record<keyof T, string[]>>;
}

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
