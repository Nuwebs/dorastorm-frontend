<script setup lang="ts">
import { ref } from 'vue';
import {
  UiAlertDialogRoot,
  UiAlertDialogContent,
  UiAlertDialogHeader,
  UiAlertDialogFooter,
  UiAlertDialogTitle,
  UiAlertDialogDescription,
  UiAlertDialogCancel,
  UiAlertDialogAction,
  type UiAlertDialogProps
} from '.';

defineProps<UiAlertDialogProps>();

const emit = defineEmits<{
  accepted: [];
  rejected: [];
}>();

const isOpen = ref<boolean>(true);

function accept(): void {
  emit('accepted');
  isOpen.value = false;
}

function reject(): void {
  emit('rejected');
  isOpen.value = false;
}
</script>

<template>
  <UiAlertDialogRoot v-model:open="isOpen">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ title }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ message }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel
          :button-variant="cancelButtonVariant"
          @click="reject"
        >
          {{ rejectLabel }}
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          :button-variant="acceptButtonVariant"
          @click="accept"
        >
          {{ acceptLabel }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialogRoot>
</template>

<style scoped></style>
