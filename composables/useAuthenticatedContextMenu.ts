import { computed } from 'vue';
import useLocaleSwitchMenu from './useLocaleSwitchMenu';
import { navigateTo, useI18n, useLocalePath } from '#imports';
import useAuthStore from '~/stores/auth-store';
import type { DsMenuItem } from '~/types/menu';

export default function useAuthenticatedContextMenu() {
  const localeMenu = useLocaleSwitchMenu();
  const { t } = useI18n();
  const lp = useLocalePath();
  const { user } = useAuthStore();

  const processed = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t('general.locales'),
        icon: 'pi pi-globe',
        items: localeMenu
      },
      {
        label: t('modules.users.update_self'),
        icon: 'pi pi-pencil',
        command: () => navigateTo(lp(`/users/edit-${user?.id}`))
      },
      {
        label: t('modules.users.change_password'),
        icon: 'pi pi-key',
        command: () => navigateTo(lp(`/users/change-password`))
      }
    ];
  });

  return {
    processed
  };
}
