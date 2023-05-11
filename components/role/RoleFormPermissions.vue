<template>
  <div class="roles-permissions-container p-1 border-1 border-round">
    <div class="grid grid-nogutter">
      <div class="col-12 md:col-6" v-for="column in slices">
        <div v-for="permissionModule in column" :key="permissionModule.module"
          class="m-2 p-2 surface-ground border-round border-1 surface-border">
          <p class="text-center m-0">{{ permissionModule.module.toUpperCase() }}</p>
          <div v-for="permission in permissionModule.permissions" :key="permission">
            <FormCheckboxValue v-model="rolePermissions" :name="permission" :content="permission" :label="permission" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import useAuthStore from '~/stores/authStore';
import { RolePermissionGroup } from '~/types/dorastorm';
import { getPermissionsGroups } from '~/utils/permissions';
import FormCheckboxValue from '../form/FormCheckboxValue.vue';

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>();
const rolePermissions = ref<string[]>(props.modelValue);
const userPermissions = ref<RolePermissionGroup[]>(getPermissionsGroups(useAuthStore().user!.role.permissions));
const emit = defineEmits(["update:modelValue"]);
const slices = computed(() => {
  const mid = Math.ceil(userPermissions.value.length / 2);
  return [
    userPermissions.value.slice(0, mid),
    userPermissions.value.slice(mid),
  ];
});

watch(rolePermissions, (newValue: string[], oldValue: string[]): void => {
  if (newValue.length !== oldValue.length) {
    emit("update:modelValue", rolePermissions.value);
  }
})
</script>
<style scoped>
.roles-permissions-container {
  max-height: 700px;
  border-color: #ced4da;
  overflow-y: scroll;
}
</style>