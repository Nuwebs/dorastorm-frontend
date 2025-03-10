<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { useTemplateRef } from 'vue';
import { definePageMeta, useI18n } from '#imports';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import TemplateLazyLoadingIndex from '~/components/template/TemplateLazyLoadingIndex.vue';
import UserDeleteButton from '~/components/user/UserDeleteButton.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import { PERMISSION } from '~/services/permission-service';
import { UserService } from '~/services/user-service';
import type { User } from '~/types/user';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.USERS_READ]
});

const { t } = useI18n();
const { userCan, roleCan, userIsAllowed } = useCachedPermissions([
  PERMISSION.USERS_UPDATE,
  PERMISSION.USERS_DELETE
]);
const service = new UserService();

const columns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: t('general.id'), enableSorting: false },
  {
    accessorKey: 'name',
    header: t('modules.users.name'),
    enableSorting: false
  },
  {
    accessorKey: 'role.name',
    header: t('modules.users.role'),
    enableSorting: false
  },
  { accessorKey: 'email', header: t('forms.email'), enableSorting: false },
  { accessorKey: 'action', header: t('general.action'), enableSorting: false }
];

const templateRef = useTemplateRef('index');
const handleUserDeleted = () => {
  templateRef.value?.refresh();
};
</script>

<template>
  <TemplateLazyLoadingIndex
    ref="index"
    :service="service"
    :columns="columns"
    module-name="users"
  >
    <template v-if="userIsAllowed" #action="{ rowValue: data }">
      <UserDeleteButton
        v-if="
          userCan(PERMISSION.USERS_UPDATE) && roleCan(data.role.hierarchy, true)
        "
        :user="data"
        @deleted="handleUserDeleted"
      />
      <ButtonActionUpdate
        v-if="
          userCan(PERMISSION.USERS_UPDATE) && roleCan(data.role.hierarchy, true)
        "
        route="/users/edit-{id}"
        :model-id="data.id"
      />
    </template>
  </TemplateLazyLoadingIndex>
</template>
