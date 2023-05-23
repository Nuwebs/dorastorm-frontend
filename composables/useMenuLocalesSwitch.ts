import { navigateTo, useSwitchLocalePath, useValidationLocales } from "#imports";
import { DsMenuItem } from "~/types/dorastorm";
import { LOCALES } from "~/services/i18n";

export default function useMenuLocalesSwitch() {
  const sw = useSwitchLocalePath();

  async function switchLocale(localeCode: string): Promise<void> {    
    useValidationLocales(localeCode);
    await navigateTo(sw(localeCode));
  }

  function generateLocalesSwitches(): DsMenuItem[] {
    return LOCALES.map((locale): DsMenuItem => {
      return {
        label: locale.name,
        command: async () => switchLocale(locale.code),
      };
    });
  };

  return generateLocalesSwitches();
}