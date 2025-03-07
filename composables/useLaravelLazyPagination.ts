import type { QueryBuilder } from '@vortechron/query-builder-ts';
import { computed, ref } from 'vue';
import { useAsyncData, useNuxtApp } from '#app';
import type { BaseService } from '~/services/base-service';
import type { FilterObject, LaravelPaginationWrapper } from '~/types/dorastorm';
import type { CustomFetchOptions } from '~/types/fetch';

export default async function useLaravelLazyPagination<DataT = unknown>(
  service: BaseService<DataT>,
  filterObj: FilterObject = {},
  options: CustomFetchOptions = {}
) {
  const currentPage = ref<number>(1);
  const filters = ref<FilterObject>(filterObj);

  const fetcher = useNuxtApp().$api;

  const { data, error, status, refresh } = await useAsyncData(() =>
    fetcher<LaravelPaginationWrapper<DataT>>(buildQuery(), options as object)
  );

  const totalResults = computed<number>(() => {
    if (data.value === null) return 0;
    return data.value.meta.total;
  });

  const resultsPerPage = computed<number>(() => {
    if (data.value === null) return 0;
    return data.value.meta.per_page;
  });

  const loading = computed<boolean>(() => {
    return status.value === 'pending';
  });

  function buildQuery(): string {
    let resultQuery: QueryBuilder = service.query();
    for (const [filter, value] of Object.entries(filters.value)) {
      if (value) {
        resultQuery = resultQuery.filter(filter, value);
      }
    }
    return resultQuery.page(currentPage.value).build();
  }

  async function search(page?: number) {
    currentPage.value = page ? page : 1;
    await refresh();
  }

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

  return {
    filters,
    currentPage,
    search,
    calculatePageAfterNItemsDeletion,

    paginationData: data,
    error,
    loading,

    totalResults,
    resultsPerPage
  };
}
