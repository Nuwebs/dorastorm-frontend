import { navigateTo, useNuxtApp, useSwitchLocalePath } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { logout } from "../auth";
import { LOCALES } from "~/services/i18n";

const sw = useSwitchLocalePath();
const t = useNuxtApp().$i18n.t;

const signOut = async (): Promise<void> => {
  await logout();
  navigateTo("/");
};

const generateLocalesSwitches = (): DsMenuItem[] => {
  return LOCALES.map((locale): DsMenuItem => {
    return {
      label: locale.name,
      command: async () => await navigateTo(sw(locale.code)),
    };
  });
};

const COMMON_MENU_OPTIONS: DsMenuItem[] = [
  {
    label: t("general.locales"),
    icon: "pi pi-globe",
    items: generateLocalesSwitches(),
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

export default COMMON_MENU_OPTIONS;
