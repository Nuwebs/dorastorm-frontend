<template>
  <div>
    <h3 class="my-0">{{ $t("modules.roles.role_permissions") }}</h3>
    <div class="grid grid-nogutter mt-2 justify-content-start">
      <div class="col-fixed" style="width: 200px;" v-for="role in rolePermissions" :key="role.module">
        <div class="m-1 border-solid border-1 surface-border">
          <h4 class="my-1 text-center">{{ role.module.toUpperCase() }}</h4>
          <ul class="permission-list p-0 m-0">
            <li v-for="permission in role.permissions" :key="permission">
              {{ permission }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Role, RolePermissionGroup } from '~/types/dorastorm';
import { ref, onMounted } from 'vue';
import { getPermissionsGroups } from '~/utils/permissions';

interface Props {
  role: Role
}

const props = defineProps<Props>();
const rolePermissions = ref<RolePermissionGroup[]>([]);

onMounted(() => {
  const processed = getPermissionsGroups(props.role.permissions);
  rolePermissions.value = processed.sort((a: RolePermissionGroup, b: RolePermissionGroup) => {
    if (a.module < b.module){
      return -1;
    } else if (a.module > b.module) {
      return 1;
    }
    return 0;
  });
});
</script>
<style scoped>
.permission-list {
  list-style: none;
}

.permission-list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.permission-list li:hover {
  background-color: #f9f9f9;
}
</style>