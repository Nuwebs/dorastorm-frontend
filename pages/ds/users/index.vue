<template>
  <section>
    <DataTableBase :data="paginationData" :total-records="totalResults" :paginator-rows="resultsPerPage"
      :loading="loading" lazy-paginator @page="(e: DataTablePageEvent) => toPage(e.page + 1)">
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.users.name')" />
      <Column field="email" :header="$t('forms.email')" />
      <Column field="id" :header="$t('general.action')" v-if="userIsAllowed">
        <template #body="row">
          <ActionButtonDelete endpoint="/users/{id}" :model-id="row.data.id" :cd-messages="{
              header: $t('modules.users.delete'),
              message: $t('modules.users.delete_warning')
            }" @deleted="deleted" v-if="userCan('users-delete')" />
        </template>
      </Column>
    </DataTableBase>
  </section>
</template>

<script setup lang="ts">
import DataTableBase from '~/components/dataTable/DataTableBase.vue';
import Column from 'primevue/column';
import { definePageMeta, onMounted } from '#imports';
import { User } from "~/types/dorastorm";
import use403Toast from '~/composables/use403Toast';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import { useToast } from 'primevue/usetoast';
import { DataTablePageEvent } from 'primevue/datatable';
import useLazyPagination from '~/composables/useLazyPagination';
import ActionButtonDelete from '~/components/actionButton/ActionButtonDelete.vue';
import useCachedPermissions from "~/composables/useCachedPermissions";

definePageMeta({
  middleware: ["auth-guard"],
  permissions: ["users-read"]
});

const toast = useToast();
const { userCan, userIsAllowed } = useCachedPermissions(['users-update', 'users-delete'])
const { paginationData, loading, totalResults, toPage, resultsPerPage, currentPage }
  = useLazyPagination<User>("/users");

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