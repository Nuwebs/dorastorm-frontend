import {
  navigateTo,
  useMenuLocalesSwitch,
  useLocalePath,
  useI18n,
} from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { computed, ComputedRef } from "vue";

const useGuestOptions = (): ComputedRef<DsMenuItem[]> => {
  const { t } = useI18n();
  const lp = useLocalePath();

  const menu = computed<DsMenuItem[]>(() => {
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

  return menu;
};

export default useGuestOptions;
