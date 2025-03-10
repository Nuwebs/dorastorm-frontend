<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { definePageMeta, useI18n } from '#imports';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import DataTable from '~/components/datatable/DataTable.vue';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import UiInput from '~/components/ui/input/UiInput.vue';
import UserDeleteButton from '~/components/user/UserDeleteButton.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import useLaravelLazyPagination from '~/composables/useLaravelLazyPagination';
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
const {
  paginationData,
  filters,
  loading,
  totalResults,
  resultsPerPage,
  currentPage,
  search,
  calculatePageAfterNItemsDeletion
} = useLaravelLazyPagination<User>(service, {
  global: null
});

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: t('general.id'),
    enableSorting: false
  },
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
  {
    accessorKey: 'email',
    header: t('forms.email'),
    enableSorting: false
  },
  {
    accessorKey: 'action',
    header: t('general.action'),
    enableSorting: false
  }
];

async function handleUserDeleted(): Promise<void> {
  search(calculatePageAfterNItemsDeletion());
}
</script>
<template>
  <section class="container">
    <h1>{{ $t('modules.users.list') }}</h1>
    <DataTable
      :columns="columns"
      :data="paginationData?.data ?? []"
      :loading="loading"
      :total-records="totalResults"
      :rows-per-page="resultsPerPage"
      lazy
      paginatable
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

      <template v-if="userIsAllowed" #cell-action="{ rowValue: data }">
        <UserDeleteButton
          v-if="
            userCan(PERMISSION.USERS_UPDATE) &&
            roleCan(data.role.hierarchy, true)
          "
          :user="data"
          @deleted="handleUserDeleted"
        />
        <ButtonActionUpdate
          v-if="
            userCan(PERMISSION.USERS_UPDATE) &&
            roleCan(data.role.hierarchy, true)
          "
          route="/users/edit-{id}"
          :model-id="data.id"
        />
      </template>
    </DataTable>
  </section>
</template>
