<template>
  <section class="container">
    <h1 class="mt-0">
      {{ $t('modules.quotations.list') }}
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
        <QuotationDataRow :quotation="slotProps.data" />
      </template>

      <Column expander />
      <Column field="id" :header="$t('general.id')" />
      <Column field="subject" :header="$t('modules.quotations.subject')" />
      <Column field="name" :header="$t('modules.quotations.name')" />
      <Column field="created_at" :header="$t('general.created_at')">
        <template #body="slotProps">
          {{ useDateFormat(slotProps.data.created_at) }}
        </template>
      </Column>
      <Column
        v-if="userCan(Permission.QUOTATIONS_DELETE)"
        field="id"
        :header="$t('general.action')"
      >
        <template #body="row">
          <ActionButtonDelete
            v-if="userCan(Permission.QUOTATIONS_DELETE)"
            endpoint="/quotations/{id}"
            :model-id="row.data.id"
            :cd-messages="{
              header: $t('modules.quotations.delete'),
              message: $t('modules.quotations.delete_warning')
            }"
            @deleted="deleted"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DataTable, { DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Permission from '~/utils/permissions';
import { DataTableFilter, Quotation } from '~/types/dorastorm';
import QuotationDataRow from '~/components/quotation/QuotationDataRow.vue';

import useLazyPagination from '~/composables/useLazyPagination';
import useCachedPermissions from '~/composables/useCachedPermissions';
import { definePageMeta, useDateFormat } from '#imports';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [Permission.QUOTATIONS_READ]
});

const { userCan } = useCachedPermissions([Permission.QUOTATIONS_DELETE]);
const {
  paginationData,
  loading,
  totalResults,
  toPage,
  resultsPerPage,
  currentPage
} = useLazyPagination<Quotation>('/quotations');

const expanded = ref<Quotation[]>([]);
const filters = ref<DataTableFilter<Quotation>>({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS }
});

async function deleted(): Promise<void> {
  let page = currentPage.value;
  if (paginationData.value.length - 1 <= 0) {
    page = currentPage.value - 1 >= 0 ? currentPage.value - 1 : 1;
  }
  await toPage(page);
}

async function search(page: number = 1) {
  await toPage(page, `filter[global]=${filters.value.global.value}`);
}

onMounted(async () => {
  await toPage(1);
});
</script>
