<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <Dropdown
      v-model="value"
      class="w-full"
      :name="name"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :loading="loading"
      :placeholder="loading ? $t('general.loading') : placeholder"
      :class="{ 'p-invalid': errorMessage }"
      :filter="!!filter"
    />
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts" generic="T = number, OptionsT = number[]">
import { toRef } from 'vue';
import { useField } from 'vee-validate';
import Dropdown from 'primevue/dropdown';

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

const { errorMessage, value } = useField<T>(toRef(props, 'name'), undefined, {
  syncVModel: true
});
</script>
