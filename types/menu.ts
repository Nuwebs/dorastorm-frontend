import type { Permission } from '~/services/permission-service';

export interface DsMenuItem {
  label?: string | (() => string);
  icon?: string;
  command?: () => unknown;
  url?: string;

  to?: string;
  permissions?: Permission | Permission[];
  items?: DsMenuItem[];
}
