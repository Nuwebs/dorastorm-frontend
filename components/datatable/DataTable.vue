<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable
} from '@tanstack/vue-table';
import { ref } from 'vue';
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
}>();

const sorting = ref<SortingState>([]);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() {
      return sorting.value;
    }
  }
});
</script>

<template>
  <div class="border rounded-md">
    <UiTable>
      <UiTableHeader>
        <UiTableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
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
      <UiTableBody>
        <template v-if="table.getRowModel().rows?.length">
          <UiTableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
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
