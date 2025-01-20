<script setup lang="ts">
import { InputText } from 'primevue';
import { useField, ErrorMessage } from 'vee-validate';

const props = defineProps<{
  name: string;
  label: string;
  modelValue?: string | null;
  type: 'text' | 'password' | 'email';
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
    <InputText
      v-model="value"
      :title="name"
      class="w-full"
      :type="type"
      :invalid="errorMessage !== undefined"
    />
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
