<template>
  <section>
    <DataTableBase :data="paginationData" :total-records="totalResults" :paginator-rows="resultsPerPage"
      :loading="loading" lazy-paginator @page="(e: DataTablePageEvent) => toPage(e.page + 1)">
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.users.name')" />
      <Column field="email" :header="$t('forms.email')" />
      <Column header="action"></Column>
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

definePageMeta({
  middleware: ["auth-guard"],
  permissions: ["users-read"]
});

const toast = useToast();
const { paginationData, loading, totalResults, toPage, resultsPerPage } = useLazyPagination<User>("/users");

onMounted(async () => {
  const res = await toPage(1);
  if (res) {
    if (res.statusCode === 403) return toast.add(use403Toast());
    return toast.add(useGeneralErrorToast());
  }
});

</script>