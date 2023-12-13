import { useLocalePath, useI18n } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import Permission from "~/utils/permissions";
import { computed, ComputedRef } from "vue";

const useSidebar = (): ComputedRef<DsMenuItem[]> => {
  const lp = useLocalePath();
  const { t } = useI18n();

  const SIDEBAR = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t("modules.users.title"),
        icon: "pi pi-user",
        permissions: [
          Permission.USERS_CREATE,
          Permission.USERS_READ,
          Permission.USERS_UPDATE,
          Permission.USERS_DELETE,
        ],
        items: [
          {
            label: t("general.new"),
            icon: "pi pi-user-plus",
            to: lp("/ds/users/create"),
            permissions: Permission.USERS_CREATE,
          },
          {
            label: t("modules.users.index"),
            icon: "pi pi-list",
            to: lp("/ds/users"),
            permissions: Permission.USERS_READ,
          },
        ],
      },
      {
        label: t("modules.roles.title"),
        icon: "pi pi-id-card",
        permissions: [
          Permission.ROLES_CREATE,
          Permission.ROLES_READ,
          Permission.ROLES_UPDATE,
          Permission.ROLES_DELETE,
        ],
        items: [
          {
            label: t("general.new"),
            icon: "pi pi-plus",
            to: lp("/ds/roles/create"),
            permissions: Permission.ROLES_CREATE,
          },
          {
            label: t("modules.roles.index"),
            icon: "pi pi-list",
            to: lp("/ds/roles"),
            permissions: Permission.ROLES_READ,
          },
        ],
      },
      // {
      //   label: t("modules.posts.title"),
      //   icon: "pi pi-book",
      //   permissions: [
      //     Permission.POSTS_CREATE,
      //     Permission.POSTS_READ,
      //     Permission.POSTS_UPDATE,
      //     Permission.POSTS_DELETE,
      //   ],
      //   items: [
      //     {
      //       label: t("general.new"),
      //       icon: "pi pi-plus",
      //       to: "/",
      //       permissions: Permission.POSTS_CREATE,
      //     },
      //     {
      //       label: t("modules.posts.index_mine"),
      //       icon: "pi pi-briefcase",
      //       to: "/",
      //       permissions: Permission.POSTS_CREATE,
      //     },
      //     {
      //       separator: true,
      //     },
      //     {
      //       label: t("modules.posts.index"),
      //       icon: "pi pi-list",
      //       to: "/",
      //     },
      //     {
      //       label: t("modules.posts.index_private"),
      //       icon: "pi pi-building",
      //       to: "/",
      //     },
      //   ],
      // },
      {
        label: t("modules.quotations.title"),
        icon: "pi pi-envelope",
        permissions: [
          Permission.QUOTATIONS_READ,
          Permission.QUOTATIONS_DELETE,
        ],
        items: [
          {
            label: t("modules.quotations.index"),
            icon: "pi pi-list",
            to: lp("/ds/quotations"),
          },
        ],
      },
    ];
  });

  return SIDEBAR;
};

export default useSidebar;
