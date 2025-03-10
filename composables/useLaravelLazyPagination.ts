import type { QueryBuilder } from '@vortechron/query-builder-ts';
import { computed, ref } from 'vue';
import { useAsyncData, useNuxtApp } from '#app';
import type { BaseService } from '~/services/base-service';
import type { FilterObject, LaravelPaginationWrapper } from '~/types/dorastorm';
import type { CustomFetchOptions } from '~/types/fetch';

export default function useLaravelLazyPagination<DataT = unknown>(
  service: BaseService<DataT>,
  filterObj: FilterObject = {},
  options: CustomFetchOptions = {}
) {
  // Reactive state for pagination and filters
  const currentPage = ref<number>(1);
  const filters = ref<FilterObject>(filterObj);

  // Access the fetcher from Nuxt app context
  const fetcher = useNuxtApp().$api;

  // Use useAsyncData without awaiting it
  const { data, error, status, refresh } = useAsyncData(() =>
    fetcher<LaravelPaginationWrapper<DataT>>(buildQuery(), options as object)
  );

  // Computed properties based on the reactive data
  const totalResults = computed<number>(() => {
    if (data.value === null) return 0;
    return data.value?.meta.total ?? 0;
  });

  const resultsPerPage = computed<number>(() => {
    if (data.value === null) return 0;
    return data.value?.meta.per_page ?? 0;
  });

  const loading = computed<boolean>(() => {
    return status.value === 'pending';
  });

  // Build the query string based on filters and current page
  function buildQuery(): string {
    let resultQuery: QueryBuilder = service.query();
    for (const [filter, value] of Object.entries(filters.value)) {
      if (value) {
        resultQuery = resultQuery.filter(filter, value);
      }
    }
    return resultQuery.page(currentPage.value).build();
  }

  // Search function to update page and refresh data
  function search(page?: number) {
    currentPage.value = page ?? 1;
    refresh(); // No await needed; refresh happens asynchronously
  }

  // Calculate the appropriate page after deleting items
  function calculatePageAfterNItemsDeletion(removedItems: number = 1): number {
    if (removedItems < 0) {
      throw new Error('The removed items parameter cannot be negative.');
    }

    const remainingItems = totalResults.value - removedItems;
    if (remainingItems <= 0) {
      return 1;
    }

    const maxPage = Math.ceil(remainingItems / resultsPerPage.value);
    return Math.min(currentPage.value, maxPage);
  }

  // Return reactive state and methods
  return {
    filters,
    currentPage,
    search,
    calculatePageAfterNItemsDeletion,

    paginationData: data, // Renamed for clarity; contains the fetched data
    error,
    loading,

    totalResults,
    resultsPerPage
  };
}
