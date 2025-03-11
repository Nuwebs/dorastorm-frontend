import { Globe, Key, Pen } from 'lucide-vue-next';
import { computed } from 'vue';
import useLocaleSwitchMenu from './useLocaleSwitchMenu';
import { useI18n } from '#imports';
import useAuthStore from '~/stores/auth-store';
import type { DsMenuItem } from '~/types/menu';

export default function useAuthenticatedContextMenu() {
  const localeMenu = useLocaleSwitchMenu();
  const { t } = useI18n();
  const { user } = useAuthStore();

  const processed = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t('general.locales'),
        icon: Globe,
        items: localeMenu
      },
      {
        label: t('modules.users.update_self'),
        icon: Pen,
        to: `/users/edit-${user?.id}`
      },
      {
        label: t('modules.users.change_password'),
        icon: Key,
        to: '/users/change-password'
      }
    ];
  });

  return {
    processed
  };
}
