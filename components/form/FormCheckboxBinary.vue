<script setup lang="ts">
import { useField, ErrorMessage } from 'vee-validate';
import UiCheckbox from '../ui/checkbox/UiCheckbox.vue';

const props = defineProps<{
  name: string;
  label: string;
  modelValue?: boolean;
}>();

const { value, errorMessage } = useField<boolean>(props.name, undefined, {
  syncVModel: true
});
</script>

<template>
  <div class="items-top flex gap-x-2">
    <UiCheckbox
      v-model="value"
      :name="name"
      :invalid="errorMessage !== undefined"
    />
    <div class="grid gap-1.5 leading-none">
      <slot name="label">
        <label :for="name" class="block">{{ label }}</label>
      </slot>
      <slot name="subLabel" />
      <slot name="errorMessage" :error-message-bag="errorMessage">
        <ErrorMessage :name="name" class="text-red-400" />
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
