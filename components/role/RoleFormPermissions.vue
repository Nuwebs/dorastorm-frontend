<template>
  <div>
    <div v-for="permissionModule in userPermissions" :key="permissionModule.module">
      <span>{{ permissionModule.module.toUpperCase() }}</span>
      <hr class="w-1 mx-0 my-1">
      <div v-for="permission in permissionModule.permissions" :key="permission">
        <FormCheckboxValue v-model="rolePermissions" :name="permission" :content="permission" :label="permission" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
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

watch(rolePermissions, (newValue: string[], oldValue: string[]): void => {
  if (newValue.length !== oldValue.length) {
    emit("update:modelValue", rolePermissions.value);
  }
})
</script>