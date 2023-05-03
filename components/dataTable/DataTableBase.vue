<template>
  <DataTable v-bind="dataTableOptions" v-model:expanded-rows="expandedRows" v-model:filters="props.filters">
    <template #header v-if="props.globalFilterFields">
      <slot name="globalFilter" />
    </template>
    <Column expander style="width: 5rem" v-if="props.expandable"></Column>
    <Column v-for="col in props.columns" :key="col.fieldName" :field="col.fieldName" :header="col.header"
      :sortable="!!col.sortable" v-if="props.columns" />
    <slot v-if="!props.columns"></slot>
    <template #expansion="expandedProps" v-if="props.expandable">
      <slot name="expansion" v-bind="expandedProps" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
// If you are using lazy mode, you will have to implement the sort, page and filter methods.
// For the page and sort you will get an event. For the filter is totally up to you.
import DataTable, { DataTablePageEvent, DataTableSortEvent } from "primevue/datatable";
import Column from "primevue/column";
import {DataTableColumn, Filter} from "../../types/dorastorm";
import { computed, ref } from "vue";

interface DataTableProps {
  data: any[];
  totalRecords: number;
  columns?: DataTableColumn[];
  paginator?: boolean;
  paginatorRows?: number;
  lazyPaginator?: boolean;
  removableSort?: boolean;
  globalFilterFields?: string[];
  filters?: {
    [key: symbol]: Filter;
  }
  expandable?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<DataTableProps>(), {
  paginator: true,
  paginatorRows: 15,
  lazyPaginator: false,
  removableSort: true,
  expandable: false,
  loading: false
});

const emit = defineEmits(["page", "sort", "filter", "update:filters"]);
const expandedRows = ref<any[]>([]);

const dataTableOptions = computed(() => {
  let options: any = {
    value: props.data,
    loading: props.loading,
    expandable: props.expandable,
    removableSort: props.removableSort
  };
  if (props.paginator) {
    options["paginator"] = true;
    options["rows"] = props.paginatorRows;
    if (props.lazyPaginator) {
      options["lazy"] = true;
      options["onPage"] = (event:DataTablePageEvent) => emit("page", event);
      options["onSort"] = (event:DataTableSortEvent) => emit("sort", event);
      options["totalRecords"] = props.totalRecords;
    }
  }
  if (props.filters) {
    options["filters"] = props.filters;
    options["filterDisplay"] = "row";
    options["onUpdate:filters"] = (event: any) => emit("update:filters", event.target.value)
  }
  if (props.globalFilterFields)
    options["globalFilterFields"] = props.globalFilterFields;

  return options;
});

</script>