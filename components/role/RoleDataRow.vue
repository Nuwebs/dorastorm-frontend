<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPermissionsGroups } from '~/services/permission-service';
import type { Role, RolePermissionGroup } from '~/types/role';

const props = defineProps<{
  role: Role;
}>();
const rolePermissions = ref<RolePermissionGroup[]>([]);

onMounted(() => {
  const processed = getPermissionsGroups(props.role.permissions);
  rolePermissions.value = processed.sort(
    (a: RolePermissionGroup, b: RolePermissionGroup) => {
      if (a.module < b.module) {
        return -1;
      } else if (a.module > b.module) {
        return 1;
      }
      return 0;
    }
  );
});
</script>
<template>
  <div>
    <h3 class="my-0 text-lg font-bold">
      {{ $t('modules.roles.role_permissions') }}
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <div
        v-for="roleI in rolePermissions"
        :key="roleI.module"
        class="bg-white border border-gray-300 rounded-md p-4 shadow-sm"
      >
        <h4
          class="text-center text-base font-semibold uppercase text-gray-800 mb-2"
        >
          {{ roleI.module }}
        </h4>
        <ul class="list-none m-0 p-0 divide-y divide-gray-200">
          <li
            v-for="permission in roleI.permissions"
            :key="permission"
            class="py-2 px-4 hover:bg-gray-100 transition duration-200"
          >
            {{ permission }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
