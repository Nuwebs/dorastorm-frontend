import { navigateTo, useSwitchLocalePath } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { LOCALES } from "~/services/i18n";

export default function useMenuLocalesSwitch() {
  const sw = useSwitchLocalePath();

  function generateLocalesSwitches(): DsMenuItem[] {
    return LOCALES.map((locale): DsMenuItem => {
      return {
        label: locale.name,
        command: async () => await navigateTo(sw(locale.code)),
      };
    });
  };

  return generateLocalesSwitches();
}