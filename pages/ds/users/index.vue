<template>
  <section class="container">
    <h1 class="mt-0">
      {{ $t('modules.users.list') }}
    </h1>
    <DataTable
      v-model:expanded-rows="expanded"
      v-model:filters="filters"
      :loading="loading"
      lazy
      :value="paginationData"
      paginator
      :total-records="totalResults"
      :rows="resultsPerPage"
      data-key="id"
      @page="(e: DataTablePageEvent) => toPage(e.page + 1)"
    >
      <template #header>
        <div class="flex justify-content-between">
          <Button
            icon="pi pi-refresh"
            class="mr-2"
            @click="search(currentPage)"
          />
          <div>
            <div class="flex alig-items-center">
              <InputText
                v-model="filters['global'].value"
                class="max-w-10rem md:max-w-full"
                @keyup.enter="search()"
              />
              <Button icon="pi pi-search" @click="search()" />
            </div>
          </div>
        </div>
      </template>
      <template #expansion="slotProps">
        <UserDataRow :user="slotProps.data" />
      </template>
      <Column expander />
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.users.name')" />
      <Column field="email" :header="$t('forms.email')" />
      <Column v-if="userIsAllowed" field="id" :header="$t('general.action')">
        <template #body="row">
          <ActionButtonDelete
            v-if="
              userCan(Permission.USERS_DELETE) &&
              roleCan(row.data.role.hierarchy, true)
            "
            endpoint="/users/{id}"
            :model-id="row.data.id"
            :cd-messages="{
              header: $t('modules.users.delete'),
              message: $t('modules.users.delete_warning')
            }"
            @deleted="deleted"
          />
          <ActionButtonUpdate
            v-if="
              userCan(Permission.USERS_UPDATE) &&
              roleCan(row.data.role.hierarchy, true)
            "
            route="/ds/users/edit-{id}"
            :model-id="row.data.id"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import DataTable, { DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { definePageMeta, onMounted } from '#imports';
import { DataTableFilter, User } from '~/types/dorastorm';
import use403Toast from '~/composables/use403Toast';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';

import useLazyPagination from '~/composables/useLazyPagination';
import ActionButtonDelete from '~/components/actionButton/ActionButtonDelete.vue';
import ActionButtonUpdate from '~/components/actionButton/ActionButtonUpdate.vue';
import UserDataRow from '~/components/user/UserDataRow.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import Permission from '~/utils/permissions';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [Permission.USERS_READ]
});

const toast = useToast();
const { userCan, roleCan, userIsAllowed } = useCachedPermissions([
  Permission.USERS_UPDATE,
  Permission.USERS_DELETE
]);
const {
  paginationData,
  loading,
  totalResults,
  toPage,
  resultsPerPage,
  currentPage
} = useLazyPagination<User>('/users');

const expanded = ref<User[]>([]);
const filters = ref<DataTableFilter<User>>({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS }
});

async function loadData(page: number): Promise<void> {
  const res = await toPage(page);
  if (res) {
    if (res.statusCode === 403) {
      return toast.add(use403Toast());
    }
    return toast.add(useGeneralErrorToast());
  }
}

async function deleted(): Promise<void> {
  let page = currentPage.value;
  if (paginationData.value.length - 1 <= 0) {
    page = currentPage.value - 1 >= 0 ? currentPage.value - 1 : 1;
  }
  await loadData(page);
}

async function search(page: number = 1) {
  await toPage(page, `filter[global]=${filters.value.global.value}`);
}

onMounted(async () => {
  await loadData(1);
});
</script>
