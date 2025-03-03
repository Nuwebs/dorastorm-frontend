<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { useConfirm, useI18n } from '#imports';
import UiButton from '~/components/ui/button/UiButton.vue';

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
