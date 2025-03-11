<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { useI18n } from '#imports';
import UiButton from '~/components/ui/button/UiButton.vue';
import useConfirmDialog from '~/composables/useConfirmDialog';

const props = defineProps<{
  loading?: boolean;
  confirmDialog: {
    header: string;
    message: string;
  };
}>();
const emit = defineEmits<{
  deletionConfirmed: [];
  deletionCanceled: [];
}>();

const { require } = useConfirmDialog();
const { t } = useI18n();

async function showConfirmDialog() {
  const result = await require({
    title: props.confirmDialog.header,
    message: props.confirmDialog.message,
    acceptLabel: t('general.delete'),
    rejectLabel: t('general.cancel'),

    acceptButtonVariant: 'destructive'
  });

  return result ? emit('deletionConfirmed') : emit('deletionCanceled');
}
</script>

<template>
  <UiButton
    :loading="loading"
    variant="destructive"
    aria-label="Delete"
    @click="showConfirmDialog"
  >
    <Trash2 />
  </UiButton>
</template>

<style scoped></style>
