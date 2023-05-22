import { navigateTo, useMenuLocalesSwitch, useNuxtApp, useLocalePath } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { computed } from "vue";

const t = useNuxtApp().$i18n.t;
const lp = useLocalePath();

const GUEST_OPTIONS = computed<DsMenuItem[]>(() => {
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
      label: t("general.login"),
      icon: "pi pi-sign-in",
      command: async () => await navigateTo(lp("/login")),
    },
  ];
});

export default GUEST_OPTIONS;
