<template>
  <section>
    <DataTableBase :data="users" :total-records="totalResults" :paginator-rows="resultsPerPage" :loading="loading"
      lazy-paginator>
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.users.name')" />
      <Column field="email" :header="$t('forms.email')" />
    </DataTableBase>
  </section>
</template>

<script setup lang="ts">
import DataTableBase from '~/components/dataTable/DataTableBase.vue';
import Column from 'primevue/column';
import { ref } from "vue";
import { definePageMeta, onMounted, use403Toast, useFetch } from '#imports';
import { PaginationWrapper, User } from "~/types/dorastorm";
import useAuthOptions from '~/composables/useAuthOptions';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import { useToast } from 'primevue/usetoast';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: ["users-read"]
});

const users = ref<User[]>([]);
const endpoint = "/users";
const toast = useToast();

const loading = ref<boolean>(false);
const currentPage = ref<number>(1);
const totalResults = ref<number>(0);
const resultsPerPage = ref<number>(0);

const fetchUsers = async (page: number = 1): Promise<void> => {
  loading.value = true;
  const ep = endpoint + `?page=${page}`;
  const { data, error } = await useFetch<PaginationWrapper<User>>(ep, useAuthOptions());
  loading.value = false;
  if (error.value) {
    if (error.value?.statusCode === 403) return toast.add(use403Toast());
    return toast.add(useGeneralErrorToast());
  }
  users.value = data.value!.data;
  currentPage.value = data.value!.meta.current_page;
  totalResults.value = data.value!.meta.total;
  resultsPerPage.value = data.value!.meta.per_page;
}

const toPage = async (page: number): Promise<void> => {
  await fetchUsers(page);
}

onMounted(async () => {
  await toPage(currentPage.value);
});


</script>