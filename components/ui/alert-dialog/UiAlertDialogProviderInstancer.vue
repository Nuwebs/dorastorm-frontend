<script setup lang="ts">
import { ref } from 'vue';
import type { UiAlertDialogProps } from '.';
import UiAlertDialog from './UiAlertDialog.vue';

interface Dialog {
  props: UiAlertDialogProps;
  resolve: (value: boolean) => void;
}

const dialogs = ref<Dialog[]>([]);

function addDialog(props: Dialog['props']) {
  return new Promise<boolean>((resolve) => {
    dialogs.value.push({ props, resolve });
  });
}

function removeDialog() {
  dialogs.value.shift(); // Remove the oldest
}

defineExpose({
  addDialog,
  removeDialog
});
</script>

<template>
  <div>
    <UiAlertDialog
      v-for="(dialog, index) in dialogs"
      :key="index"
      v-bind="dialog.props"
      @accepted="dialog.resolve(true)"
      @rejected="dialog.resolve(false)"
    />
  </div>
</template>

<style scoped></style>
