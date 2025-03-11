import { User, UserPlus, List, IdCard, Plus } from 'lucide-vue-next';
import { computed } from 'vue';
import useDsMenuItems from './useDsMenuItems';
import { useI18n } from '#imports';
import { PERMISSION } from '~/services/permission-service';

export default function useAuthenticatedMenu() {
  const { t } = useI18n();
  const { parse } = useDsMenuItems();

  const raw = computed(() => {
    return [
      {
        label: t('modules.users.title'),
        icon: User,
        permissions: [
          PERMISSION.USERS_CREATE,
          PERMISSION.USERS_READ,
          PERMISSION.USERS_UPDATE,
          PERMISSION.USERS_DELETE
        ],
        items: [
          {
            label: t('general.new'),
            icon: UserPlus,
            to: '/users/create',
            permissions: PERMISSION.USERS_CREATE
          },
          {
            label: t('modules.users.index'),
            icon: List,
            to: '/users',
            permissions: PERMISSION.USERS_READ
          }
        ]
      },
      {
        label: t('modules.roles.title'),
        icon: IdCard,
        permissions: [
          PERMISSION.ROLES_CREATE,
          PERMISSION.ROLES_READ,
          PERMISSION.ROLES_UPDATE,
          PERMISSION.ROLES_DELETE
        ],
        items: [
          {
            label: t('general.new'),
            icon: Plus,
            to: '/roles/create',
            permissions: PERMISSION.ROLES_CREATE
          },
          {
            label: t('modules.roles.index'),
            icon: List,
            to: '/roles',
            permissions: PERMISSION.ROLES_READ
          }
        ]
      }
    ];
  });

  // Use `raw` in `useDsMenuItems` and recompute when `raw` changes
  const processed = computed(() => {
    return parse(raw.value);
  });

  return {
    raw,
    processed
  };
}
