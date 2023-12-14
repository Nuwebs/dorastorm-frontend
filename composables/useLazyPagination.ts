import { ref, Ref } from 'vue';
import { UseFetchOptions } from 'nuxt/app';
import useAPIFetch from './useAPIFetch';
import { PaginationWrapper } from '~/types/dorastorm';

// WIP Composable. It still needs the sort and filtering capabilities.
const useLazyPagination = <DataT>(
  endpoint: string,
  options: UseFetchOptions<PaginationWrapper<DataT>> = {}
) => {
  const paginationData = ref<DataT[]>([]) as Ref<DataT[]>;
  const loading = ref<boolean>(false);
  const currentPage = ref<number>(1);
  const totalResults = ref<number>(0);
  const resultsPerPage = ref<number>(0);

  async function toPage (page: number = 1, params: string = '') {
    loading.value = true;
    let ep = endpoint + `?page=${page}`;
    ep = params !== '' ? ep + `&${params}` : ep;
    const { data, error } = await useAPIFetch<PaginationWrapper<DataT>>({
      endpoint: ep,
      options
    });
    loading.value = false;
    if (error.value) { return error.value; }
    paginationData.value = data.value!.data;
    currentPage.value = data.value!.meta.current_page;
    totalResults.value = data.value!.meta.total;
    resultsPerPage.value = data.value!.meta.per_page;
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
