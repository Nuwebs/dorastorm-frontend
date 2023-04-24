import { DsMenuItem } from "~/types/dorastorm";
import { MenuItem } from "primevue/menuitem";
import useAuthStore from "~/stores/authStore";

export const PERMISSIONS: DsMenuItem[] = [
  {
    label: "Users",
    icon: "pi pi-user",
    permissions: ["users-create", "users-read", "users-update", "users-delete"],
    items: [
      {
        label: "New",
        icon: "pi pi-user-plus",
        to: "/",
        permissions: "users-create"
      },
      {
        label: "View all users",
        icon: "pi pi-list",
        to: "/",
        permissions: "users-read"
      },
    ],
  },
  {
    label: "Roles",
    icon: "pi pi-id-card",
    permissions: ["roles-create", "roles-read", "roles-update", "roles-delete"],
    items: [
      {
        label: "New",
        icon: "pi pi-plus",
        to: "/",
        permissions: "roles-create"
      },
      {
        label: "View all roles",
        icon: "pi pi-list",
        to: "/",
        permissions: "roles-read"
      },
    ],
  },
  {
    label: "Posts",
    icon: "pi pi-book",
    permissions: ["posts-create", "posts-read", "posts-update", "posts-delete"],
    items: [
      {
        label: "New",
        icon: "pi pi-plus",
        to: "/",
        permissions: "posts-create"
      },
      {
        label: "My posts",
        icon: "pi pi-briefcase",
        to: "/",
        permissions: "posts-create"
      },
      {
        separator: true,
      },
      {
        label: "View posts",
        icon: "pi pi-list",
        to: "/"
      },
      {
        label: "Staff posts",
        icon: "pi pi-building",
        to: "/"
      },
    ],
  },
  {
    label: "Quotations",
    icon: "pi pi-envelope",
    permissions: ["quotations-read", "quotations-delete"],
    items: [
      {
        label: "View all quotations",
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
