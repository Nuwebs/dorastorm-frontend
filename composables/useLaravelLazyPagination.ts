import { ref, type Ref } from 'vue';
import type { LaravelPaginationWrapper } from '~/types/dorastorm';
import type { UtilFetchOptions } from '~/types/fetch';
import apiFetch from '~/utils/api-fetch';

/**
 * This composable is experimental.
 * It is only compatible with the SPA fetcher
 */
export default function useLaravelLazyPagination<DataT>(
  endpoint: string,
  options: UtilFetchOptions<LaravelPaginationWrapper<DataT>> = {}
) {
  const paginationData = ref<DataT[]>([]) as Ref<DataT[]>;
  const loading = ref<boolean>(false);
  const currentPage = ref<number>(1);
  const totalResults = ref<number>(0);
  const resultsPerPage = ref<number>(0);

  async function toPage(page: number = 1, params: string = '') {
    loading.value = true;

    let ep = endpoint + `?page=${page}`;
    ep = params !== '' ? ep + `&${params}` : ep;
    const { data, error } = await apiFetch<LaravelPaginationWrapper<DataT>>({
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
}
