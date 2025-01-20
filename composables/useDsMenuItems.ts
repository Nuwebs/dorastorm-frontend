import type { MenuItem } from 'primevue/menuitem';
import type { Permission } from '~/services/permission-service';
import useAuthStore from '~/stores/auth-store';
import type { DsMenuItem } from '~/types/menu';

export default function useDsMenuItems() {
  const { hasPermission, hasAnyPermission } = useAuthStore();

  function processMenuItems(
    dsMenuItems: DsMenuItem[],
    hasPermission: (permission: Permission) => boolean,
    hasAnyPermission: (permissions: Permission[]) => boolean
  ): MenuItem[] {
    return dsMenuItems.reduce<MenuItem[]>((processedMenuItems, menuItem) => {
      // If the menuItem does not have permissions, we can safely add it
      if (!menuItem.permissions) {
        processedMenuItems.push(menuItem);
        return processedMenuItems;
      }

      const isPermissionsArray = Array.isArray(menuItem.permissions);
      const checker = isPermissionsArray ? hasAnyPermission : hasPermission;

      // Si no tiene el permiso necesario, lo saltamos.
      if (!checker(menuItem.permissions as Permission & Permission[])) {
        return processedMenuItems;
      }

      // Si tiene items, los procesamos recursivamente.
      if (menuItem.items) {
        menuItem.items = processMenuItems(
          menuItem.items,
          hasPermission,
          hasAnyPermission
        );
      }

      processedMenuItems.push(menuItem);
      return processedMenuItems;
    }, []);
  }

  function parse(items: DsMenuItem[]) {
    return processMenuItems(items, hasPermission, hasAnyPermission);
  }

  return {
    parse,
    parser: processMenuItems
  };
}
