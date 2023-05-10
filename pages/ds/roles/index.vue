<template>
  <section class="p-container">
    <h1 class="mt-0">{{ $t("modules.roles.list") }}</h1>
    <DataTableBase :data="paginationData" :total-records="totalResults" :paginator-rows="resultsPerPage"
      :loading="loading" lazy-paginator @page="(e: DataTablePageEvent) => toPage(e.page + 1)" expandable>
      <template #expansion="slotProps">
        <RoleData :role="slotProps.data"/>
      </template>
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.roles.name')" />
      <Column field="description" :header="$t('modules.roles.description')" />
      <Column field="id" :header="$t('general.action')" v-if="userIsAllowed">
        <template #body="row">
          <ActionButtonDelete endpoint="/roles/{id}" :model-id="row.data.id" :cd-messages="{
              header: $t('modules.roles.delete'),
              message: $t('modules.roles.delete_warning')
            }" @deleted="deleted" v-if="userCan(PERMISSIONS.ROLES_DELETE)" />
          <!-- <ActionButtonUpdate route="/ds/users/edit-{id}" :model-id="row.data.id" v-if="userCan('users-update')" /> -->
        </template>
      </Column>
    </DataTableBase>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, use403Toast, useGeneralErrorToast } from '#imports';
import { useToast } from 'primevue/usetoast';
import useCachedPermissions from "~/composables/useCachedPermissions";
import useLazyPagination from "~/composables/useLazyPagination";
import { Role } from '~/types/dorastorm';
import { onMounted } from "vue";
import DataTableBase from '~/components/dataTable/DataTableBase.vue';
import { DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import RoleData from '~/components/role/RoleData.vue';
import { PERMISSIONS } from '~/services/permissions';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.ROLES_READ]
});

const toast = useToast();
const { userCan, userIsAllowed } = useCachedPermissions([PERMISSIONS.ROLES_UPDATE, PERMISSIONS.ROLES_DELETE])
const { paginationData, loading, totalResults, toPage, resultsPerPage, currentPage }
  = useLazyPagination<Role>("/roles");

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


onMounted(async () => {
  await loadData(1);
});

</script>