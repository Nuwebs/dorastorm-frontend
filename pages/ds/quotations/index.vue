<template>
  <section class="container">
    <h1 class="mt-0">{{ $t("modules.quotations.list") }}</h1>
    <DataTableBase :data="paginationData" :total-records="totalResults" :paginator-rows="resultsPerPage"
      :loading="loading" lazy-paginator @page="(e: DataTablePageEvent) => toPage(e.page + 1)" expandable>
      <template #expansion="slotProps">
        <QuotationDataRow :quotaiton="slotProps.data" />
      </template>
      <Column field="id" :header="$t('general.id')" />
      <Column field="subject" :header="$t('modules.quotations.subject')" />
      <Column field="name" :header="$t('modules.quotations.name')" />
      <Column field="created_at" :header="$t('general.created_at')">
        <template #body="slotProps">
          {{ dateFormat(slotProps.data.created_at) }}
        </template>
      </Column>
      <Column field="id" :header="$t('general.action')" v-if="userCan(PERMISSIONS.QUOTATIONS_DELETE)">
        <template #body="row">
          <ActionButtonDelete endpoint="/quotations/{id}" :model-id="row.data.id" :cd-messages="{
            header: $t('modules.quotations.delete'),
            message: $t('modules.quotations.delete_warning')
          }" @deleted="deleted" v-if="userCan(PERMISSIONS.QUOTATIONS_DELETE)" />
        </template>
      </Column>
    </DataTableBase>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useDateFormat, useRelativeTime } from '#imports';
import useCachedPermissions from "~/composables/useCachedPermissions";
import useLazyPagination from "~/composables/useLazyPagination";
import { onMounted } from "vue";
import DataTableBase from '~/components/dataTable/DataTableBase.vue';
import { DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import PERMISSIONS from '~/utils/permissions';
import { Quotation } from '~/types/dorastorm';
import QuotationDataRow from '~/components/quotation/QuotationDataRow.vue';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.QUOTATIONS_READ]
});

const { userCan } = useCachedPermissions([PERMISSIONS.QUOTATIONS_DELETE]);
const { paginationData, loading, totalResults, toPage, resultsPerPage, currentPage }
  = useLazyPagination<Quotation>("/quotations");
const dateFormat = useDateFormat();

async function deleted(): Promise<void> {
  let page = currentPage.value;
  if (paginationData.value.length - 1 <= 0) {
    page = currentPage.value - 1 >= 0 ? currentPage.value - 1 : 1;
  };
  await toPage(page);
}

onMounted(async () => {
  await toPage(1);
})
</script>