<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { useTemplateRef } from 'vue';
import { definePageMeta, useI18n } from '#imports';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import RoleDataRow from '~/components/role/RoleDataRow.vue';
import RoleDeleteButton from '~/components/role/RoleDeleteButton.vue';
import TemplateLazyLoadingIndex from '~/components/template/TemplateLazyLoadingIndex.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import { PERMISSION } from '~/services/permission-service';
import { RoleService } from '~/services/role-service';
import type { Role } from '~/types/role';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_READ]
});

const { t } = useI18n();
const { userCan, roleCan, userIsAllowed } = useCachedPermissions([
  PERMISSION.ROLES_DELETE,
  PERMISSION.ROLES_UPDATE
]);
const service = new RoleService();

const columns: ColumnDef<Role>[] = [
  { accessorKey: 'id', header: t('general.id'), enableSorting: false },
  {
    accessorKey: 'name',
    header: t('modules.roles.name'),
    enableSorting: false
  },
  {
    accessorKey: 'description',
    header: t('modules.roles.description'),
    enableSorting: false
  },
  { accessorKey: 'action', header: t('general.action'), enableSorting: false }
];

const templateRef = useTemplateRef('index');
const handleRoleDeleted = () => {
  templateRef.value?.refresh();
};
</script>

<template>
  <TemplateLazyLoadingIndex
    ref="index"
    :service="service"
    :columns="columns"
    module-name="roles"
    has-expandable
  >
    <template #expanded="{ row }">
      <RoleDataRow :role="row.original" />
    </template>
    <template v-if="userIsAllowed" #action="{ rowValue: data }">
      <RoleDeleteButton
        v-if="
          userCan(PERMISSION.ROLES_DELETE) && roleCan(data.hierarchy, false)
        "
        :role="data"
        @deleted="handleRoleDeleted"
      />
      <ButtonActionUpdate
        v-if="
          userCan(PERMISSION.ROLES_UPDATE) && roleCan(data.hierarchy, false)
        "
        route="/roles/edit-{id}"
        :model-id="data.id"
      />
    </template>
  </TemplateLazyLoadingIndex>
</template>
