<script setup lang="ts">
import { ref } from 'vue';
import ButtonActionDelete from '../button/action/ButtonActionDelete.vue';
import { useI18n, useToast } from '#imports';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { RoleService } from '~/services/role-service';
import type { Role } from '~/types/role';

const props = defineProps<{
  role: Role;
}>();
const emit = defineEmits<{
  deleted: [role: Role];
}>();

const loading = ref<boolean>(false);
const toast = useToast();
const { t } = useI18n();
const { getGeneric403Message, getGeneric404Message, getGenericErrorMessage } =
  useGenericToastMessages();

async function handleRoleDeleted(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  const { error } = await new RoleService().deleteById(props.role.id);
  loading.value = false;

  if (error) {
    switch (error.statusCode) {
      case 403:
        return toast.add(getGeneric403Message());
      case 404:
        return toast.add(getGeneric404Message());
      case 422:
        return toast.add({
          severity: 'error',
          summary: 'Role in use',
          detail: 'There are users using this role.'
        });
      default:
        return toast.add(getGenericErrorMessage());
    }
  }

  toast.add({
    severity: 'success',
    summary: props.role.name,
    detail: t('modules.roles.deleted'),
    life: 10000
  });
  return emit('deleted', props.role);
}
</script>

<template>
  <ButtonActionDelete
    :loading="loading"
    :confirm-dialog="{
      header: $t('modules.roles.delete'),
      message: $t('modules.roles.delete_warning')
    }"
    @deletion-confirmed="handleRoleDeleted"
  />
</template>

<style scoped></style>
