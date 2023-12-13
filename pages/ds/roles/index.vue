<template>
  <section class="container">
    <h1 class="mt-0">{{ $t("modules.roles.list") }}</h1>
    <DataTable :loading="loading" lazy :value="paginationData" paginator :total-records="totalResults"
      :rows="resultsPerPage" data-key="id" v-model:expanded-rows="expanded" v-model:filters="filters"
      @page="(e: DataTablePageEvent) => toPage(e.page + 1)">
      <template #header>
        <div class="flex justify-content-between">
          <Button icon="pi pi-refresh" class="mr-2" @click="search(currentPage)" />
          <div>
            <div class="flex alig-items-center">
              <InputText v-model="(filters['global'].value as string)" class="max-w-10rem md:max-w-full"
                @keyup.enter="search()" />
              <Button icon="pi pi-search" @click="search()" />
            </div>
          </div>
        </div>
      </template>
      <template #expansion="slotProps">
        <RoleData :role="slotProps.data" />
      </template>

      <Column expander />
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.roles.name')" />
      <Column field="description" :header="$t('modules.roles.description')" />
      <Column field="id" :header="$t('general.action')" v-if="userIsAllowed">
        <template #body="row">
          <ActionButtonDelete endpoint="/roles/{id}" :model-id="row.data.id" :cd-messages="{
            header: $t('modules.roles.delete'),
            message: $t('modules.roles.delete_warning')
          }" @deleted="deleted" v-if="userCan(Permission.ROLES_DELETE) && roleCan(row.data.hierarchy)" />
          <ActionButtonUpdate route="/ds/roles/edit-{id}" :model-id="row.data.id"
            v-if="userCan(Permission.ROLES_UPDATE) && roleCan(row.data.hierarchy)" />
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, use403Toast, useGeneralErrorToast } from '#imports';
import { useToast } from 'primevue/usetoast';
import useCachedPermissions from "~/composables/useCachedPermissions";
import useLazyPagination from "~/composables/useLazyPagination";
import { DataTableFilter, Role } from '~/types/dorastorm';
import { onMounted, ref } from "vue";
import { DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import RoleData from '~/components/role/RoleData.vue';
import Permission from '~/utils/permissions';
import DataTable from 'primevue/datatable';
import { FilterMatchMode } from 'primevue/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [Permission.ROLES_READ]
});

const toast = useToast();
const { userCan, userIsAllowed, roleCan } = useCachedPermissions([Permission.ROLES_UPDATE, Permission.ROLES_DELETE])
const { paginationData, loading, totalResults, toPage, resultsPerPage, currentPage }
  = useLazyPagination<Role>("/roles");

const expanded = ref<Role[]>([]);
const filters = ref<DataTableFilter<Role>>({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS }
});

async function loadData(page: number): Promise<void> {
  const res = await toPage(page);
  if (res) {
    if (res.statusCode === 403) return toast.add(use403Toast());
    return toast.add(useGeneralErrorToast());
  }
}

async function deleted(): Promise<void> {
  let page = currentPage.value;
  if (paginationData.value.length - 1 <= 0) {
    page = currentPage.value - 1 >= 0 ? currentPage.value - 1 : 1;
  };
  await loadData(page);
}

async function search(page: number = 1) {
  await toPage(page, `filter[global]=${filters.value.global.value}`);
}

onMounted(async () => {
  await loadData(1);
});
</script>