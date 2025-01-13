import type { QueryBuilder } from '@vortechron/query-builder-ts';
import { ref, type Ref } from 'vue';
import type { FilterObject, LaravelPaginationWrapper } from '~/types/dorastorm';
import type { UtilFetchOptions } from '~/types/fetch';
import apiFetch from '~/utils/api-fetch';

/**
 * This composable is experimental.
 * It is only compatible with the SPA fetcher
 */
export default function useLaravelLazyPagination<DataT>(
  filterObj: FilterObject = {},
  options: UtilFetchOptions<LaravelPaginationWrapper<DataT>> = {}
) {
  const paginationData = ref<DataT[]>([]) as Ref<DataT[]>;
  const loading = ref<boolean>(false);
  const currentPage = ref<number>(1);
  const totalResults = ref<number>(0);
  const resultsPerPage = ref<number>(0);
  const filters = ref<FilterObject>(filterObj);

  function calculatePageAfterNItemsDeletion(removedItems: number = 1): number {
    if (removedItems < 0) {
      throw new Error('The removed items parameter can not be negative.');
    }

    // Calculate the remaining items after removal
    const remainingItems = totalResults.value - removedItems;
    // If there are no remaining items, return to the first page
    if (remainingItems <= 0) {
      return 1;
    }

    // Calculate the maximum number of pages that can be displayed with the remaining items
    const maxPage = Math.ceil(remainingItems / resultsPerPage.value);

    // Ensure the current page is within the valid range (no higher than maxPage)
    return Math.min(currentPage.value, maxPage);
  }

  function applyFilters(query: QueryBuilder): QueryBuilder {
    let resultQuery: QueryBuilder = query;
    for (const [filter, value] of Object.entries(filters.value)) {
      if (value.value) {
        resultQuery = resultQuery.filter(filter, value.value);
      }
    }
    return resultQuery;
  }

  async function toPage(query: QueryBuilder, page: number = 1) {
    loading.value = true;

    const { data, error } = await apiFetch<LaravelPaginationWrapper<DataT>>({
      endpoint: applyFilters(query).page(page).build(),
      options
    });

    loading.value = false;

    if (error) {
      return error;
    }

    paginationData.value = data!.data;
    currentPage.value = data!.meta.current_page;
    totalResults.value = data!.meta.total;
    resultsPerPage.value = data!.meta.per_page;
  }

  return {
    paginationData,
    loading,
    filters,
    currentPage,
    totalResults,
    resultsPerPage,

    toPage,
    applyFilters,
    calculatePageAfterNItemsDeletion
  };
}
