<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  ExpandedState,
  PaginationState
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

type BaseProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  loading?: boolean;
  expandable?: boolean;
  paginatable?: boolean;
  lazy?: boolean;
};

type LazyProps = {
  lazy: true;
  rowsPerPage: number;
  totalRecords: number;
};

type NonLazyProps = {
  lazy?: false;
  rowsPerPage?: number;
  totalRecords?: number;
};

const props = defineProps<
  BaseProps<TData, TValue> & (LazyProps | NonLazyProps)
>();

const emit = defineEmits<{
  'update:sorting': [SortingState];
  'update:filters': [ColumnFiltersState];
  'update:globalFilter': [string];
  'update:pagination': [PaginationState];
}>();

// Reactive state for table features
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const globalFilter = ref<string>('');
const expanded = ref<ExpandedState>({});
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: props.lazy
    ? props.rowsPerPage
    : props.paginatable
    ? props.rowsPerPage ?? 25
    : Number.MAX_SAFE_INTEGER
});

// Initialize TanStack Table with conditional options
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: props.lazy ? undefined : getSortedRowModel(),
  getFilteredRowModel: props.lazy ? undefined : getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getPaginationRowModel: props.lazy ? undefined : getPaginationRowModel(),

  manualPagination: props.lazy,
  manualSorting: props.lazy,
  manualFiltering: props.lazy,
  pageCount: props.lazy
    ? Math.ceil(props.totalRecords / pagination.value.pageSize)
    : undefined,
  globalFilterFn: 'includesString',

  onSortingChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, sorting);
    emit('update:sorting', sorting.value);
  },
  onColumnFiltersChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnFilters);
    emit('update:filters', columnFilters.value);
  },
  onGlobalFilterChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, globalFilter);
    emit('update:globalFilter', globalFilter.value);
  },
  onPaginationChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, pagination);
    emit('update:pagination', pagination.value);
  },
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
    },
    get pagination() {
      return pagination.value;
    }
  }
});

// Compute total items for pagination
const totalItems = computed(() => {
  if (props.lazy) {
    return props.totalRecords;
  } else {
    return table.getFilteredRowModel().rows.length;
  }
});

// Current page (1-based for UiPagination, 0-based for TanStack)
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
      <UiTableHeader>
        <UiTableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <UiTableHead v-if="props.expandable" class="w-4" />
          <UiTableHead v-for="header in headerGroup.headers" :key="header.id">
            <div
              v-if="header.column.getCanSort() && !loading"
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

      <UiTableBody>
        <template v-if="table.getRowModel().rows?.length && !loading">
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
                    :row-value="row.original"
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
            <UiTableRow v-if="row.getIsExpanded() && props.expandable">
              <!-- Expander adds a "virtual" column that is not in the data/columns, so it must add 1 -->
              <UiTableCell :colspan="row.getAllCells().length + 1">
                <slot name="expanded" :row="row" />
              </UiTableCell>
            </UiTableRow>
          </template>
        </template>
        <template v-else>
          <UiTableRow>
            <UiTableCell
              :colspan="columns.length + (props.expandable ? 1 : 0)"
              class="h-24 text-center"
            >
              <slot v-if="!loading" name="empty-data" />
              <slot v-else name="loading" />
            </UiTableCell>
          </UiTableRow>
        </template>
      </UiTableBody>
    </UiTable>

    <!-- Pagination -->
    <div class="w-full flex justify-center mt-2">
      <UiPagination
        v-if="props.lazy || props.paginatable"
        v-model:page="currentPage"
        :total-items="totalItems"
        :items-per-page="table.getState().pagination.pageSize"
        :disabled="loading"
      />
    </div>
  </div>
</template>
