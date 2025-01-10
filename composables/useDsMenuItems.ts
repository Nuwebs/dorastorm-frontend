import { computed, ref } from 'vue';
import useAuthStore from '~/stores/auth-store';
import type { Permission } from '~/services/permission-service';
import type { MenuItem } from 'primevue/menuitem';
import type { DsMenuItem } from '~/types/menu';

export default function useDsMenuItems(items: DsMenuItem[]) {
  const dsMenuItems = ref<DsMenuItem[]>(items);
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

  const processed = computed<MenuItem[]>(() => {
    return processMenuItems(dsMenuItems.value, hasPermission, hasAnyPermission);
  });

  return {
    processed,
    processMenuItems
  };
}
