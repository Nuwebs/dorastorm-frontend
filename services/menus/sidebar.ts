import { useLocalePath, useNuxtApp } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import PERMISSIONS from "~/utils/permissions";
import { computed } from "vue";

const lp = useLocalePath();
const t = useNuxtApp().$i18n.t;

const SIDEBAR = computed<DsMenuItem[]>(() => {
  return [
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
          to: lp("/ds/roles/create"),
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
          to: lp("/ds/quotations"),
        },
      ],
    },
  ];
});

export default SIDEBAR;
