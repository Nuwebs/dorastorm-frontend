import type { RouteLocationNormalized } from 'vue-router';
import type { Permission } from '~/services/permission-service';

export interface DsRouteMeta extends RouteLocationNormalized {
  meta: RouteLocationNormalized['meta'] & {
    strictPermissions?: boolean;
    permissions?: Permission[];
  };
}

// Error related
export interface LaravelErrorBag {
  message: string;
}

export interface LaravelValidationErrorBag<T> extends LaravelErrorBag {
  errors: Partial<Record<keyof T, string[]>>;
}

export interface LaravelPaginationWrapper<DataT> {
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
