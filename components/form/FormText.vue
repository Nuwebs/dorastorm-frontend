<script setup lang="ts">
import { useField, ErrorMessage } from 'vee-validate';
import UiInput from '../ui/input/UiInput.vue';

const props = defineProps<{
  name: string;
  label: string;
  modelValue?: string | null;
  type: 'text' | 'password' | 'email';
  placeholder?: string;
}>();

const { value, errorMessage } = useField<typeof props.modelValue>(
  props.name,
  undefined,
  {
    syncVModel: true
  }
);
</script>

<template>
  <div>
    <slot name="label">
      <label :for="name" class="block">{{ label }}</label>
    </slot>
    <UiInput
      v-model="value"
      :title="name"
      class="w-full"
      :type="type"
      :placeholder="placeholder"
      :invalid="errorMessage !== undefined"
    />
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
