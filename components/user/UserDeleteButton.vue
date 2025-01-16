<script setup lang="ts">
import { ref } from 'vue';
import ButtonActionDelete from '../button/action/ButtonActionDelete.vue';
import { UserService } from '~/services/user-service';
import type { User } from '~/types/user';
import { useI18n, useToast } from '#imports';
import useGenericToastMessages from '~/composables/useGenericToastMessages';

const props = defineProps<{
  user: User;
}>();
const emit = defineEmits<{
  deleted: [user: User];
}>();

const loading = ref<boolean>(false);
const toast = useToast();
const { t } = useI18n();
const { getGeneric403Message, getGeneric404Message, getGenericErrorMessage } =
  useGenericToastMessages();

async function handleUserDelete(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  const { error } = await new UserService().deleteById(props.user.id);
  loading.value = false;

  if (error) {
    switch (error.statusCode) {
      case 403:
        return toast.add(getGeneric403Message());
      case 404:
        return toast.add(getGeneric404Message());
      case 409:
        return toast.add({
          severity: 'warn',
          summary: t('error.409.default_title'),
          detail: t('error.409.specific.last_admin')
        });
      default:
        return toast.add(getGenericErrorMessage());
    }
  }

  toast.add({
    severity: 'success',
    summary: props.user.name,
    detail: t('modules.users.deleted'),
    life: 10000
  });
  return emit('deleted', props.user);
}
</script>

<template>
  <ButtonActionDelete
    :loading="loading"
    :confirm-dialog="{
      header: $t('modules.users.delete'),
      message: $t('modules.users.delete_warning')
    }"
    @deletion-confirmed="handleUserDelete"
  />
</template>

<style scoped></style>
