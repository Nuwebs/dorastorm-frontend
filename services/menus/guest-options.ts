import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import {
  navigateTo,
  useMenuLocalesSwitch,
  useI18n,
  useNuxtApp
} from '#imports';
import type { DsMenuItem } from '~/types/dorastorm';

const useGuestOptions = (): ComputedRef<DsMenuItem[]> => {
  const { t } = useI18n();
  const lp = useNuxtApp().$localePath;

  const menu = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t('general.locales'),
        icon: 'pi pi-globe',
        items: useMenuLocalesSwitch()
      },
      {
        separator: true
      },
      {
        label: t('general.login'),
        icon: 'pi pi-sign-in',
        command: async () => await navigateTo(lp('/login'))
      }
    ];
  });

  return menu;
};

export default useGuestOptions;
