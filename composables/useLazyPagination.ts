import type { Ref } from 'vue';
import type { UseFetchOptions } from 'nuxt/app';
import { ref } from 'vue';
import type { PaginationWrapper } from '~/types/dorastorm';
import apiFetch from '~/utils/api-fetch';

// WIP Composable. It still needs the sort and filtering capabilities.
// This could be refactored to use useAPIFetch
const useLazyPagination = <DataT>(
  endpoint: string,
  options: UseFetchOptions<PaginationWrapper<DataT>> = {}
) => {
  const paginationData = ref<DataT[]>([]) as Ref<DataT[]>;
  const loading = ref<boolean>(false);
  const currentPage = ref<number>(1);
  const totalResults = ref<number>(0);
  const resultsPerPage = ref<number>(0);

  async function toPage(page: number = 1, params: string = '') {
    loading.value = true;
    let ep = endpoint + `?page=${page}`;
    ep = params !== '' ? ep + `&${params}` : ep;
    const { data, error } = await apiFetch<PaginationWrapper<DataT>>({
      endpoint: ep,
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
    currentPage,
    totalResults,
    resultsPerPage,
    toPage
  };
};

export default useLazyPagination;
