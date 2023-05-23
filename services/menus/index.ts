import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";
import useSidebar from "./sidebar";
import useCommonOptions from "./commonOptions";
import cloneDeep from "lodash-es/cloneDeep";
import { ComputedRef } from "vue";
import useGuestOptions from "./guestOptions";

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

// This function receives the computed property of the DsMenuItem array.
// This is meant to properly update the lang if it is switched
const getMenuItems = (dsMenuItems: ComputedRef<DsMenuItem[]>): MenuItem[] => {
  let menu = cloneDeep<DsMenuItem[]>(dsMenuItems.value);
  // Write here any operation that should be done
  // before the menu processing.
  return processMenuItems(menu);
};

export const sidebarMenuItems = () => {
  return getMenuItems(useSidebar());
};

export const commonMenuOptions = () => {
  return getMenuItems(useCommonOptions());
};

export const guestMenuOptions = () => {
  return getMenuItems(useGuestOptions());
};
