import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";
import SIDEBAR from "./sidebar";

const getMenuItems = (dsMenuItems: DsMenuItem[]): MenuItem[] => {
  const authStore = useAuthStore();
  let processedMenuItems: MenuItem[] = [];
  for (let menuItem of dsMenuItems) {
    if (!menuItem.permissions) {
      processedMenuItems.push(menuItem);
      continue;
    }
    const isPermissionsArray = menuItem.permissions instanceof Array;
    const checker = isPermissionsArray
      ? authStore.hasAnyPermission
      : authStore.hasPermission;
    if (!checker(menuItem.permissions as string & string[])) continue;

    if (menuItem.items) {
      menuItem.items = getMenuItems(menuItem.items);
    }

    const { permissions, ...pMenuItem } = menuItem;
    processedMenuItems.push(pMenuItem);
  }
  return processedMenuItems;
};

export const sidebarMenuItems = () => getMenuItems(SIDEBAR);
