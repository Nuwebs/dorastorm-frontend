<script setup lang="ts">
import { useConfirm, useI18n } from '#imports';

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

const confirm = useConfirm();
const { t } = useI18n();

function showConfirmDialog(): void {
  confirm.require({
    header: props.confirmDialog.header,
    message: props.confirmDialog.message,
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptIcon: 'pi pi-trash',
    acceptLabel: t('general.delete'),
    rejectLabel: t('general.cancel'),
    accept: () => emit('deletionConfirmed'),
    reject: () => emit('deletionCanceled')
  });
}
</script>

<template>
  <Button
    icon="pi pi-trash"
    text
    rounded
    aria-label="Delete"
    severity="danger"
    :loading="loading"
    @click="showConfirmDialog"
  />
</template>

<style scoped></style>
