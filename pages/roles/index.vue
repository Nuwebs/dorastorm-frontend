<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { definePageMeta, useI18n } from '#imports';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import DataTable from '~/components/datatable/DataTable.vue';
import RoleDataRow from '~/components/role/RoleDataRow.vue';
import RoleDeleteButton from '~/components/role/RoleDeleteButton.vue';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import UiInput from '~/components/ui/input/UiInput.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import useLaravelLazyPagination from '~/composables/useLaravelLazyPagination';
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
const {
  paginationData,
  filters,
  loading,
  totalResults,
  resultsPerPage,
  currentPage,
  search,
  calculatePageAfterNItemsDeletion
} = useLaravelLazyPagination<Role>(service, {
  global: null
});

const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'id',
    header: t('general.id'),
    enableSorting: false
  },
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
  {
    accessorKey: 'action',
    header: t('general.action'),
    enableSorting: false
  }
];

async function handleRoleDeleted(): Promise<void> {
  search(calculatePageAfterNItemsDeletion());
}
</script>
<template>
  <section class="container">
    <h1>
      {{ $t('modules.roles.list') }}
    </h1>

    <DataTable
      :columns="columns"
      :data="paginationData?.data ?? []"
      :loading="loading"
      :total-records="totalResults"
      :rows-per-page="resultsPerPage"
      lazy
      paginatable
      expandable
      @update:pagination="(e) => search(e.pageIndex + 1)"
    >
      <template #table-header="{ table }">
        <div class="flex justify-between">
          <UiButton @click="search(currentPage)">R</UiButton>
          <div>
            <div class="flex">
              <UiInput
                v-model="filters['global']"
                type="text"
                @update:model-value="table.setGlobalFilter($event)"
                @keyup.enter="search()"
              />
              <UiButton @click="search()">S</UiButton>
            </div>
          </div>
        </div>
      </template>

      <template #loading>
        <TheLoadingSpinner />
      </template>

      <template #expanded="row">
        <RoleDataRow :role="row.row.original" />
      </template>

      <template v-if="userIsAllowed" #cell-action="{ rowValue: data }">
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
    </DataTable>
  </section>
</template>
