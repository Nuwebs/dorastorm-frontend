<script setup lang="ts">
import { ref } from 'vue';
import ButtonActionDelete from '../button/action/ButtonActionDelete.vue';
import { useToast } from '../ui/toast/use-toast';
import { useI18n } from '#imports';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { RoleService } from '~/services/role-service';
import type { Role } from '~/types/role';

const props = defineProps<{
  role: Role;
}>();
const emit = defineEmits<{
  deleted: [role: Role];
}>();

const service = new RoleService();
const loading = ref<boolean>(false);
const { toast } = useToast();
const { t } = useI18n();
const { getGeneric403Message, getGeneric404Message, getGenericErrorMessage } =
  useGenericToastMessages();

async function handleRoleDeleted(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  const { error } = await service.handledCall(
    service.deleteById(props.role.id)
  );
  loading.value = false;

  if (error) {
    switch (error.statusCode) {
      case 403:
        toast(getGeneric403Message());
        return;
      case 404:
        toast(getGeneric404Message());
        return;
      case 422:
        toast({
          variant: 'destructive',
          title: 'Role in use',
          description: 'There are users using this role.'
        });
        return;
      default:
        toast(getGenericErrorMessage());
        return;
    }
  }

  toast({
    variant: 'success',
    title: props.role.name,
    description: t('modules.roles.deleted')
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
