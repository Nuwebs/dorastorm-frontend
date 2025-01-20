<script setup lang="ts" generic="T = number, OptionsT = number">
import { Select } from 'primevue';
import { useField, ErrorMessage } from 'vee-validate';

const props = defineProps<{
  name: string;
  label: string;
  options: OptionsT[];
  optionLabel: string;
  optionValue: string;
  placeholder?: string;
  loading?: boolean;
  modelValue?: T;
  filter?: boolean;
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
    <label :for="name">{{ label }}</label>
    <Select
      v-model="value"
      :name="name"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :loading="loading"
      :placeholder="loading ? $t('general.loading') : placeholder"
      :class="{ 'p-invalid': errorMessage }"
      :filter="!!filter"
      class="w-full"
    />
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
