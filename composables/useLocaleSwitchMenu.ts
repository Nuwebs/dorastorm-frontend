import { navigateTo, useSwitchLocalePath } from '#imports';
import { LOCALES, type LocaleCode } from '~/services/i18n-service';
import type { DsMenuItem } from '~/types/menu';

export default function useLocaleSwitchMenu(): DsMenuItem[] {
  const switchLocalePath = useSwitchLocalePath();

  return (Object.keys(LOCALES) as LocaleCode[]).map<DsMenuItem>((locale) => {
    return {
      label: LOCALES[locale].name,
      command: () => navigateTo(switchLocalePath(locale))
    };
  });
}
