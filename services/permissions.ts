import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";
import { useLocalePath } from "#imports";
import { useNuxtApp } from "nuxt/app";

const lp = useLocalePath();
const t = useNuxtApp().$i18n.t;
export const PERMISSIONS: DsMenuItem[] = [
  {
    label: t("modules.users.title"),
    icon: "pi pi-user",
    permissions: ["users-create", "users-read", "users-update", "users-delete"],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-user-plus",
        to: lp("/ds/users/create"),
        permissions: "users-create"
      },
      {
        label: t("modules.users.index"),
        icon: "pi pi-list",
        to: lp("/ds/users"),
        permissions: "users-read"
      },
    ],
  },
  {
    label: t("modules.roles.title"),
    icon: "pi pi-id-card",
    permissions: ["roles-create", "roles-read", "roles-update", "roles-delete"],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-plus",
        to: "/",
        permissions: "roles-create"
      },
      {
        label: t("modules.roles.index"),
        icon: "pi pi-list",
        to: "/",
        permissions: "roles-read"
      },
    ],
  },
  {
    label: t("modules.posts.title"),
    icon: "pi pi-book",
    permissions: ["posts-create", "posts-read", "posts-update", "posts-delete"],
    items: [
      {
        label: t("general.new"),
        icon: "pi pi-plus",
        to: "/",
        permissions: "posts-create"
      },
      {
        label: t("modules.posts.index_mine"),
        icon: "pi pi-briefcase",
        to: "/",
        permissions: "posts-create"
      },
      {
        separator: true,
      },
      {
        label: t("modules.posts.index"),
        icon: "pi pi-list",
        to: "/"
      },
      {
        label: t("modules.posts.index_private"),
        icon: "pi pi-building",
        to: "/"
      },
    ],
  },
  {
    label: t("modules.quotations.title"),
    icon: "pi pi-envelope",
    permissions: ["quotations-read", "quotations-delete"],
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

export const sidebarMenuItems = () => getMenuItems(PERMISSIONS);
