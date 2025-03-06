<script setup lang="ts">
import { provide, ref } from 'vue';
import {
  PROVIDER_KEY,
  type UiAlertDialogProps,
  type UiAlertDialogProvider
} from '.';
import UiAlertDialogProviderInstancer from './UiAlertDialogProviderInstancer.vue';

const dialogInstancer = ref<InstanceType<
  typeof UiAlertDialogProviderInstancer
> | null>(null);

function addDialog(props: UiAlertDialogProps) {
  return dialogInstancer.value?.addDialog(props) ?? Promise.resolve(false);
}

function removeDialog() {
  dialogInstancer.value?.removeDialog();
}

provide<UiAlertDialogProvider>(PROVIDER_KEY, {
  addDialog,
  removeDialog
});
</script>

<template>
  <UiAlertDialogProviderInstancer ref="dialogInstancer" />
  <slot />
</template>

<style scoped></style>
