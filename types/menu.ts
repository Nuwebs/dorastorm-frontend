import type { LucideIcon } from 'lucide-vue-next';
import type { Permission } from '~/services/permission-service';

export interface DsMenuItem {
  label?: string | (() => string);
  icon?: LucideIcon;
  command?: () => unknown;
  url?: string;

  to?: string;
  permissions?: Permission | Permission[];
  items?: DsMenuItem[];
}
