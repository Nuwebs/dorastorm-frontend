<script
  setup
  lang="ts"
  generic="OptionsT extends Record<string, AcceptableValue>"
>
import type { AcceptableValue } from 'reka-ui';
import { useField, ErrorMessage } from 'vee-validate';
import UiTest from '../ui/select/UiSelect.vue';

const props = defineProps<{
  modelValue: OptionsT[keyof OptionsT] | null;
  name: string;
  label: string;
  options: OptionsT[];
  optionLabel: string;
  optionValue: string;

  placeholder?: string;
  loading?: boolean;
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
    <UiTest
      v-model="value"
      :name="name"
      :options="options"
      :value-key="optionValue"
      :label-key="optionLabel"
      :filter="filter"
      :loading="loading"
      :placeholder="loading ? $t('general.loading') : placeholder"
      :class="{ 'border-red-500 dark:border-red-400': errorMessage }"
    />
    <slot name="errorMessage" :error-message-bag="errorMessage">
      <ErrorMessage :name="name" class="text-red-400" />
    </slot>
  </div>
</template>

<style scoped></style>
