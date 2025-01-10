import type { MenuItem } from 'primevue/menuitem';
import type { Permission } from '~/services/permission-service';

export type DsMenuItem = MenuItem & {
  to?: string;
  permissions?: Permission | Permission[];
  items?: DsMenuItem[];
};
