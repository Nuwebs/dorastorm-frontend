<script setup lang="ts">
import { ref } from 'vue';
import { DataTable, type DataTablePageEvent } from 'primevue';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { definePageMeta, onMounted } from '#imports';
import { PERMISSION } from '~/services/permission-service';
import useCachedPermissions from '~/composables/useCachedPermissions';
import useLaravelLazyPagination from '~/composables/useLaravelLazyPagination';
import type { User } from '~/types/user';
import { UserService } from '~/services/user-service';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import UserDeleteButton from '~/components/user/UserDeleteButton.vue';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.USERS_READ]
});

const { userCan, roleCan, userIsAllowed } = useCachedPermissions([
  PERMISSION.USERS_UPDATE,
  PERMISSION.USERS_DELETE
]);
const userService = new UserService();
const {
  paginationData,
  filters,
  loading,
  totalResults,
  toPage,
  resultsPerPage,
  currentPage,
  calculatePageAfterNItemsDeletion
} = useLaravelLazyPagination<User>({
  global: { value: '', matchMode: 'contains' }
});

const expanded = ref<User[]>([]);

async function loadData(page: number): Promise<void> {
  const res = await toPage(userService.query(), page);
  if (res) {
    return;
  }
}

async function handleUserDeleted(): Promise<void> {
  await loadData(calculatePageAfterNItemsDeletion());
}

async function search(page: number = 1) {
  await toPage(userService.query(), page);
}

onMounted(async () => {
  await loadData(1);
});
</script>
<template>
  <section class="container">
    <h1>{{ $t('modules.users.list') }}</h1>
    <DataTable
      v-model:expanded-rows="expanded"
      v-model:filters="filters"
      :loading="loading"
      lazy
      :value="paginationData"
      paginator
      :total-records="totalResults"
      :rows="resultsPerPage"
      data-key="id"
      @page="(e: DataTablePageEvent) => search(e.page + 1)"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            icon="pi pi-refresh"
            class="mr-2"
            @click="search(currentPage)"
          />
          <div>
            <div class="flex">
              <InputText
                v-model="filters['global'].value"
                class="rounded-r-none"
                @keyup.enter="search()"
              />
              <Button
                icon="pi pi-search"
                class="rounded-l-none"
                @click="search()"
              />
            </div>
          </div>
        </div>
      </template>
      <!-- Use this commented code if you will require extra information -->
      <!-- <template #expansion="{ data }: { data: User }">
        
      </template>
      <Column expander /> -->
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.users.name')" />
      <Column field="role.name" :header="$t('modules.users.role')" />
      <Column field="email" :header="$t('forms.email')" />
      <Column v-if="userIsAllowed" field="id" :header="$t('general.action')">
        <template #body="{ data }: { data: User }">
          <UserDeleteButton
            v-if="
              userCan(PERMISSION.USERS_UPDATE) &&
              roleCan(data.role.hierarchy, true)
            "
            :user="data"
            @deleted="handleUserDeleted"
          />
          <ButtonActionUpdate
            v-if="
              userCan(PERMISSION.USERS_UPDATE) &&
              roleCan(data.role.hierarchy, true)
            "
            route="/users/edit-{id}"
            :model-id="data.id"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
