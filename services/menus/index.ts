import { MenuItem } from 'primevue/menuitem';
import cloneDeep from 'lodash-es/cloneDeep';
import { ComputedRef } from 'vue';
import useSidebar from './sidebar';
import useCommonOptions from './commonOptions';
import useGuestOptions from './guestOptions';
import useGuestNavbar from './guestNavbar';
import useAuthStore from '~/stores/authStore';
import { DsMenuItem } from '~/types/dorastorm';
import Permission from '~/utils/permissions';

const authStore = useAuthStore();

const processMenuItems = (dsMenuItems: DsMenuItem[]): MenuItem[] => {
  const processedMenuItems: MenuItem[] = [];
  for (const menuItem of dsMenuItems) {
    if (!menuItem.permissions) {
      processedMenuItems.push(menuItem);
      continue;
    }
    const isPermissionsArray = menuItem.permissions instanceof Array;
    const checker = isPermissionsArray
      ? authStore.hasAnyPermission
      : authStore.hasPermission;
    if (!checker(menuItem.permissions as Permission & Permission[])) { continue; }
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
  const menu = cloneDeep<DsMenuItem[]>(dsMenuItems.value);
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

export const guestNavbar = () => {
  return getMenuItems(useGuestNavbar());
};
