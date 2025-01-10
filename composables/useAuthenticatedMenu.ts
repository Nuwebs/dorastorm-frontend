import { computed } from 'vue';
import { useI18n } from '#imports';
import type { DsMenuItem } from '~/types/menu';
import useDsMenuItems from './useDsMenuItems';
import { PERMISSION } from '~/services/permission-service';

export default function useAuthenticatedMenu() {
  const { t } = useI18n();

  const raw = computed<DsMenuItem[]>(() => {
    return [
      {
        label: t('modules.users.title'),
        icon: 'pi pi-user',
        permissions: [
          PERMISSION.USERS_CREATE,
          PERMISSION.USERS_READ,
          PERMISSION.USERS_UPDATE,
          PERMISSION.USERS_DELETE
        ],
        items: [
          {
            label: t('general.new'),
            icon: 'pi pi-user-plus',
            to: '/users/create',
            permissions: PERMISSION.USERS_CREATE
          },
          {
            label: t('modules.users.index'),
            icon: 'pi pi-list',
            to: '/users',
            permissions: PERMISSION.USERS_READ
          }
        ]
      },
      {
        label: t('modules.roles.title'),
        icon: 'pi pi-id-card',
        permissions: [
          PERMISSION.ROLES_CREATE,
          PERMISSION.ROLES_READ,
          PERMISSION.ROLES_UPDATE,
          PERMISSION.ROLES_DELETE
        ],
        items: [
          {
            label: t('general.new'),
            icon: 'pi pi-plus',
            to: '/roles/create',
            permissions: PERMISSION.ROLES_CREATE
          },
          {
            label: t('modules.roles.index'),
            icon: 'pi pi-list',
            to: '/roles',
            permissions: PERMISSION.ROLES_READ
          }
        ]
      }
    ];
  });

  const { processed } = useDsMenuItems(raw.value);

  return {
    raw,
    processed
  };
}
