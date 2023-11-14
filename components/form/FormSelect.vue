<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <Dropdown class="w-full mb-2" :name="name" :options="options" :option-label="optionLabel" :option-value="optionValue"
      :loading="loading" :placeholder="loading ? $t('general.loading') : placeholder"
      :class="{ 'p-invalid': errorMessage }" v-model="value"/>
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts" generic="T = number">
import { toRef } from 'vue';
import { useField } from 'vee-validate';
import Dropdown from 'primevue/dropdown';

const props = defineProps<{
  name: string,
  label: string,
  options: any[],
  optionLabel: string,
  optionValue: string,
  placeholder?: string,
  loading?: boolean
  modelValue?: T
}>();

const { errorMessage, value } = useField<T>(toRef(props, 'name'), undefined, {
  syncVModel: true
});
</script>