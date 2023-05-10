import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";
import { useLocalePath } from "#imports";
import { useNuxtApp } from "nuxt/app";
import PERMISSIONS from "~/utils/permissions";

const lp = useLocalePath();
const t = useNuxtApp().$i18n.t;

export const SIDEBAR: DsMenuItem[] = [
  {
    label: t("modules.users.title"),
    icon: "pi pi-user",
    permissions: [
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_DELETE,
    ],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-user-plus",
        to: lp("/ds/users/create"),
        permissions: PERMISSIONS.USERS_CREATE,
      },
      {
        label: t("modules.users.index"),
        icon: "pi pi-list",
        to: lp("/ds/users"),
        permissions: PERMISSIONS.USERS_READ,
      },
    ],
  },
  {
    label: t("modules.roles.title"),
    icon: "pi pi-id-card",
    permissions: [
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_READ,
      PERMISSIONS.ROLES_UPDATE,
      PERMISSIONS.ROLES_DELETE,
    ],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-plus",
        to: lp("/ds/roles"),
        permissions: PERMISSIONS.ROLES_CREATE,
      },
      {
        label: t("modules.roles.index"),
        icon: "pi pi-list",
        to: lp("/ds/roles"),
        permissions: PERMISSIONS.ROLES_READ,
      },
    ],
  },
  {
    label: t("modules.posts.title"),
    icon: "pi pi-book",
    permissions: [
      PERMISSIONS.POSTS_CREATE,
      PERMISSIONS.POSTS_READ,
      PERMISSIONS.POSTS_UPDATE,
      PERMISSIONS.POSTS_DELETE,
    ],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-plus",
        to: "/",
        permissions: PERMISSIONS.POSTS_CREATE,
      },
      {
        label: t("modules.posts.index_mine"),
        icon: "pi pi-briefcase",
        to: "/",
        permissions: PERMISSIONS.POSTS_CREATE,
      },
      {
        separator: true,
      },
      {
        label: t("modules.posts.index"),
        icon: "pi pi-list",
        to: "/",
      },
      {
        label: t("modules.posts.index_private"),
        icon: "pi pi-building",
        to: "/",
      },
    ],
  },
  {
    label: t("modules.quotations.title"),
    icon: "pi pi-envelope",
    permissions: [PERMISSIONS.QUOTATIONS_READ, PERMISSIONS.QUOTATIONS_DELETE],
    items: [
      {
        label: t("modules.quotations.index"),
        icon: "pi pi-list",
        to: "/",
      },
    ],
  },
];

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
