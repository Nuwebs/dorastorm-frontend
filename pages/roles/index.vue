<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import ButtonActionUpdate from '~/components/button/action/ButtonActionUpdate.vue';
import RoleDataRow from '~/components/role/RoleDataRow.vue';
import RoleDeleteButton from '~/components/role/RoleDeleteButton.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import useLaravelLazyPagination from '~/composables/useLaravelLazyPagination';
import { PERMISSION } from '~/services/permission-service';
import { RoleService } from '~/services/role-service';
import type { Role } from '~/types/role';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [PERMISSION.ROLES_READ]
});

const { userCan, roleCan, userIsAllowed } = useCachedPermissions([
  PERMISSION.ROLES_DELETE,
  PERMISSION.ROLES_UPDATE
]);
const service = new RoleService();
const {
  paginationData,
  filters,
  loading,
  totalResults,
  resultsPerPage,
  currentPage,
  search,
  calculatePageAfterNItemsDeletion
} = await useLaravelLazyPagination<Role>(service, {
  global: { value: '', matchMode: 'contains' }
});

const expanded = ref<Role[]>([]);

async function handleRoleDeleted(): Promise<void> {
  search(calculatePageAfterNItemsDeletion());
}
</script>
<template>
  <section class="container">
    <h1>
      {{ $t('modules.roles.list') }}
    </h1>
    <DataTable
      v-model:expanded-rows="expanded"
      v-model:filters="filters"
      :loading="loading"
      lazy
      :value="paginationData?.data"
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
      <template #expansion="{ data }: { data: Role }">
        <RoleDataRow :role="data" />
      </template>
      <Column expander />
      <Column field="id" :header="$t('general.id')" />
      <Column field="name" :header="$t('modules.roles.name')" />
      <Column field="description" :header="$t('modules.roles.description')" />
      <Column v-if="userIsAllowed" field="id" :header="$t('general.action')">
        <template #body="{ data }: { data: Role }">
          <RoleDeleteButton
            v-if="
              userCan(PERMISSION.ROLES_DELETE) && roleCan(data.hierarchy, false)
            "
            :role="data"
            @deleted="handleRoleDeleted"
          />
          <ButtonActionUpdate
            v-if="
              userCan(PERMISSION.ROLES_UPDATE) && roleCan(data.hierarchy, false)
            "
            route="/roles/edit-{id}"
            :model-id="data.id"
          />
        </template>
      </Column>
    </DataTable>
  </section>
</template>
