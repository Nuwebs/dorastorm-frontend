import { computed, ComputedRef } from 'vue';
import { useLocalePath, useI18n } from '#imports';
import { DsMenuItem } from '~/types/dorastorm';

const useGuestNavbar = (): ComputedRef<DsMenuItem[]> => {
  const lp = useLocalePath();
  const { t } = useI18n();

  return computed<DsMenuItem[]>(() => {
    return [
      {
        label: t('general.home'),
        icon: 'pi pi-home',
        to: lp('/')
      }
    ];
  });
};

export default useGuestNavbar;
