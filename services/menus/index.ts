import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";
import SIDEBAR from "./sidebar";

const authStore = useAuthStore();

const processMenuItems = (dsMenuItems: DsMenuItem[]): MenuItem[] => {
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
      menuItem.items = processMenuItems(menuItem.items);
    }
    processedMenuItems.push(menuItem);
  }
  return processedMenuItems;
};

const getMenuItems = (dsMenuItems: DsMenuItem[]): MenuItem[] => {
  let menu = JSON.parse(JSON.stringify(dsMenuItems)) as DsMenuItem[];
  // Write here any operation that should be done
  // before the menu processing.
  return processMenuItems(menu);
};

export const sidebarMenuItems = () => {
  return getMenuItems(SIDEBAR);
};
