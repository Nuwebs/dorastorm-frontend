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
  getPaginationRowModel,
  useVueTable
} from '@tanstack/vue-table';
import { ref, computed } from 'vue';
import DataTableExpander from './DataTableExpander.vue';
import UiPagination from '../ui/pagination/UiPagination.vue';
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
  paginatable?: boolean;
  rowsPerPage?: number;
}>();

// Reactive state for table features
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const globalFilter = ref<string>('');
const expanded = ref<ExpandedState>({});

// Initialize the TanStack Table instance
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
  getPaginationRowModel: getPaginationRowModel(),
  globalFilterFn: 'includesString',
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: props.paginatable
        ? props.rowsPerPage ?? 25
        : Number.MAX_SAFE_INTEGER
    }
  },
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

// Computed property for current page (1-based for Pagination, 0-based for TanStack)
const currentPage = computed({
  get() {
    return table.getState().pagination.pageIndex + 1;
  },
  set(newPage) {
    table.setPageIndex(newPage - 1);
  }
});
</script>

<template>
  <div>
    <!-- Table header slot -->
    <slot
      name="table-header"
      :table="table"
      :global-filter-value="globalFilter"
    />

    <!-- Table structure -->
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

      <!-- Body -->
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
            <!-- Expansion row -->
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

    <!-- Pagination component/slot -->
    <div class="w-full flex justify-center mt-2">
      <UiPagination
        v-if="props.paginatable"
        v-model:page="currentPage"
        :total-items="table.getPrePaginationRowModel().rows.length"
        :items-per-page="table.getState().pagination.pageSize"
      />
    </div>
  </div>
</template>
