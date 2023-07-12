import {
  navigateTo,
  useNuxtApp,
  useValidationLocales,
} from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { LOCALES } from "~/services/i18n";

const useMenuLocalesSwitch = () => {
  const sw = useNuxtApp().$switchLocalePath;

  async function switchLocale(localeCode: string): Promise<void> {
    useValidationLocales(localeCode);
    await navigateTo(sw(localeCode));
  }

  function generateLocalesSwitches(): DsMenuItem[] {
    return LOCALES.map((locale): DsMenuItem => {
      return {
        label: locale.name,
        command: async () => await switchLocale(locale.code),
      };
    });
  }

  return generateLocalesSwitches();
};

export default useMenuLocalesSwitch;