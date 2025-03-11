<script setup lang="ts" generic="DataT = unknown">
import type { ColumnDef } from '@tanstack/vue-table';
import { defineProps, defineExpose } from 'vue';
import ButtonActionRefresh from '~/components/button/action/ButtonActionRefresh.vue';
import ButtonActionSearch from '~/components/button/action/ButtonActionSearch.vue';
import DataTable from '~/components/datatable/DataTable.vue';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import UiInput from '~/components/ui/input/UiInput.vue';
import useLaravelLazyPagination from '~/composables/useLaravelLazyPagination';
import type { BaseService } from '~/services/base-service';

const props = defineProps<{
  service: BaseService<DataT>; // The service (e.g., RoleService or UserService)
  columns: ColumnDef<DataT>[]; // Table columns
  moduleName: string; // For translation key (e.g., 'roles' or 'users')
  hasExpandable?: boolean; // Optional, default false
}>();

const {
  paginationData,
  filters,
  loading,
  totalResults,
  resultsPerPage,
  currentPage,
  search,
  calculatePageAfterNItemsDeletion
} = useLaravelLazyPagination(props.service, { global: null });

// Expose a refresh method for the parent to call after deletion
const refresh = () => {
  search(calculatePageAfterNItemsDeletion());
};
defineExpose({ refresh });
</script>

<template>
  <section class="container">
    <h1>{{ $t(`modules.${moduleName}.list`) }}</h1>
    <DataTable
      :columns="columns"
      :data="paginationData?.data ?? []"
      :loading="loading"
      :total-records="totalResults"
      :rows-per-page="resultsPerPage"
      lazy
      paginatable
      :expandable="hasExpandable ?? false"
      @update:pagination="(e) => search(e.pageIndex + 1)"
    >
      <template #table-header="{ table }">
        <div class="flex justify-between">
          <ButtonActionRefresh
            :loading="loading"
            @click="search(currentPage)"
          />
          <div>
            <div class="flex">
              <UiInput
                v-model="filters['global']"
                type="text"
                class="rounded-r-none"
                @update:model-value="table.setGlobalFilter($event)"
                @keyup.enter="search()"
              />
              <ButtonActionSearch
                :loading="loading"
                class="rounded-l-none"
                @click="search()"
              />
            </div>
          </div>
        </div>
      </template>

      <template #loading>
        <TheLoadingSpinner />
      </template>

      <!-- Slot for expandable row content -->
      <template v-if="hasExpandable" #expanded="row">
        <slot name="expanded" :row="row.row" />
      </template>

      <!-- Slot for action column content -->
      <template #cell-action="slotProps">
        <slot name="action" v-bind="slotProps" />
      </template>
    </DataTable>
  </section>
</template>
