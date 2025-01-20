<script setup lang="ts">
import { useField, ErrorMessage } from 'vee-validate';
import { ref, watch, computed } from 'vue';
import FormCheckboxValue from '~/components/form/FormCheckboxValue.vue';
import { getPermissionsGroups } from '~/services/permission-service';
import useAuthStore from '~/stores/auth-store';
import type { RolePermissionGroup } from '~/types/role';

const props = defineProps<{
  name: string;
  modelValue: string[];
}>();
const emit = defineEmits<{
  'update:modelValue': [permissions: string[]];
}>();

const { value } = useField<string[]>(props.name, undefined, {
  syncVModel: true
});
const { user } = useAuthStore();
const userPermissions: RolePermissionGroup[] = getPermissionsGroups(
  user?.role.permissions ?? []
);
const rolePermissions = ref<string[]>(value.value);

const slices = computed<RolePermissionGroup[][]>(() => {
  const mid = Math.ceil(userPermissions.length / 2);
  return [userPermissions.slice(0, mid), userPermissions.slice(mid)];
});

watch(rolePermissions, (newValue: string[], oldValue: string[]): void => {
  if (newValue.length !== oldValue.length) {
    emit('update:modelValue', rolePermissions.value);
  }
});
</script>
<template>
  <div class="roles-permissions-container p-2 border border-gray-300 rounded">
    <ErrorMessage :name="props.name" class="text-red-400" />
    <div class="grid grid-cols-12 gap-2">
      <div
        v-for="(column, index) in slices"
        :key="index"
        class="col-span-12 col-span-6"
      >
        <div
          v-for="permissionModule in column"
          :key="permissionModule.module"
          class="col-span-12 md:col-span-6 p-2 mb-2 bg-gray-100 rounded-md border border-gray-300"
        >
          <p class="text-center m-0 uppercase">
            {{ permissionModule.module }}
          </p>
          <div
            v-for="permission in permissionModule.permissions"
            :key="permission"
          >
            <FormCheckboxValue
              v-model="rolePermissions"
              :name="permission"
              :content="permission"
              :label="permission"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.roles-permissions-container {
  max-height: 700px;
  border-color: #ced4da;
  overflow-y: scroll;
}
</style>
