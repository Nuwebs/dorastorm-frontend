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
import { Role } from '~/types/dorastorm';
import { ref, onMounted } from 'vue';

interface Props {
  role: Role
}

interface RolePermission {
  module: string;
  permissions: string[];
}

const props = defineProps<Props>();
const rolePermissions = ref<RolePermission[]>([]);

onMounted(() => {
  const processed = props.role.permissions.reduce((acc: RolePermission[], permission: string) => {
    const module = permission.split("-")[0];
    const existingModule = acc.find((m: RolePermission) => m.module === module);

    if (existingModule) {
      existingModule.permissions.push(permission);
    } else {
      acc.push({
        module,
        permissions: [permission],
      });
    }
    return acc;
  }, []);
  rolePermissions.value = processed.sort((a: RolePermission, b: RolePermission) => {
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