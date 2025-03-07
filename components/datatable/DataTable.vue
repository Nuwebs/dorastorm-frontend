<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  ExpandedState
} from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useVueTable
} from '@tanstack/vue-table';
import { ref } from 'vue';
import DataTableExpander from './DataTableExpander.vue';
import {
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow
} from '@/components/ui/table';

import { valueUpdater } from '@/lib/utils';

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  expandable?: boolean;
}>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const globalFilter = ref<string>('');
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  globalFilterFn: 'includesString',

  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onGlobalFilterChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, globalFilter),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),

  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
    get expanded() {
      return expanded.value;
    }
  }
});
</script>

<template>
  <div>
    <slot
      name="table-header"
      :table="table"
      :global-filter-value="globalFilter"
    />
    <UiTable>
      <!-- Header -->
      <UiTableHeader>
        <UiTableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <UiTableHead v-if="props.expandable" class="w-4" />
          <UiTableHead v-for="header in headerGroup.headers" :key="header.id">
            <!-- Sortable header -->
            <div
              v-if="header.column.getCanSort()"
              class="cursor-pointer select-none"
              @click="
                header.column.toggleSorting(
                  header.column.getIsSorted() === 'asc'
                )
              "
            >
              <slot :name="`header-${header.column.id}`" :header="header">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span v-if="header.column.getIsSorted() === 'asc'">↑</span>
                <span v-if="header.column.getIsSorted() === 'desc'">↓</span>
              </slot>
            </div>
            <!-- Non-sortable header -->
            <div v-else>
              <slot :name="`header-${header.column.id}`" :header="header">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </slot>
            </div>
          </UiTableHead>
        </UiTableRow>
      </UiTableHeader>

      <!-- Rows/Body -->
      <UiTableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <UiTableRow
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <UiTableCell v-if="props.expandable">
                <slot name="expander">
                  <DataTableExpander :row="row" />
                </slot>
              </UiTableCell>
              <UiTableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <template v-if="$slots[`cell-${cell.column.id}`]">
                  <slot
                    :name="`cell-${cell.column.id}`"
                    v-bind="cell.getContext()"
                  />
                </template>
                <template v-else>
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </template>
              </UiTableCell>
            </UiTableRow>
            <!-- Expansion row. As the expander column is not in the data/columns array, we need to add 1 to the colspan -->
            <UiTableRow v-if="row.getIsExpanded() && props.expandable">
              <UiTableCell :colspan="row.getAllCells().length + 1">
                <slot name="expanded" :row="row" />
              </UiTableCell>
            </UiTableRow>
          </template>
        </template>
        <template v-else>
          <UiTableRow>
            <UiTableCell :colspan="columns.length" class="h-24 text-center">
              <slot name="empty-data" />
            </UiTableCell>
          </UiTableRow>
        </template>
      </UiTableBody>
    </UiTable>
  </div>
</template>
