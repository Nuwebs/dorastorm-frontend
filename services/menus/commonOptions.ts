import { navigateTo, useLocalePath, useMenuLocalesSwitch, useNuxtApp } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { logout } from "../auth";
import { computed } from "vue";

const t = useNuxtApp().$i18n.t;
const lp = useLocalePath();

const signOut = async (): Promise<void> => {
  await logout();
  navigateTo(lp("/"));
};

const COMMON_MENU_OPTIONS = computed<DsMenuItem[]>(() => {
  return [
    {
      label: t("general.locales"),
      icon: "pi pi-globe",
      items: useMenuLocalesSwitch(),
    },
    {
      separator: true,
    },
    {
      label: t("general.logout"),
      icon: "pi pi-sign-out",
      command: async () => await signOut(),
    },
  ];
});

export default COMMON_MENU_OPTIONS;
