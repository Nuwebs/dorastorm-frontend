<script setup lang="ts">
import { ref } from 'vue';
import ButtonActionDelete from '../button/action/ButtonActionDelete.vue';
import { useToast } from '../ui/toast/use-toast';
import { useI18n } from '#imports';
import useGenericToastMessages from '~/composables/useGenericToastMessages';
import { UserService } from '~/services/user-service';
import type { User } from '~/types/user';

const props = defineProps<{
  user: User;
}>();
const emit = defineEmits<{
  deleted: [user: User];
}>();

const service = new UserService();
const loading = ref<boolean>(false);
const { toast } = useToast();
const { t } = useI18n();
const { getGeneric403Message, getGeneric404Message, getGenericErrorMessage } =
  useGenericToastMessages();

async function handleUserDelete(): Promise<void> {
  if (loading.value) return;
  loading.value = true;
  const { error } = await service.handledCall(
    service.deleteById(props.user.id)
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
      case 409:
        toast({
          variant: 'warning',
          title: t('error.409.default_title'),
          description: t('error.409.specific.last_admin')
        });
        return;
      default:
        toast(getGenericErrorMessage());
        return;
    }
  }

  toast({
    variant: 'success',
    title: props.user.name,
    description: t('modules.users.deleted')
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
