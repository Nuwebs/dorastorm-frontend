import type { MenuItem } from 'primevue/menuitem';
import { navigateTo, useSwitchLocalePath } from '#imports';
import { LOCALES, type LocaleCode } from '~/services/i18n-service';

export default function useLocaleSwitchMenu(): MenuItem[] {
  const switchLocalePath = useSwitchLocalePath();

  return (Object.keys(LOCALES) as LocaleCode[]).map<MenuItem>((locale) => {
    return {
      label: LOCALES[locale].name,
      command: () => navigateTo(switchLocalePath(locale))
    };
  });
}
