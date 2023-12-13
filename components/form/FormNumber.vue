<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon" v-if="icon"><i :class="icon"></i></span>
      <InputNumber :name="name" v-model="value" :class="{ 'p-invalid': errorMessage }" v-bind="props.options" />
    </div>
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';

const props = defineProps<{
  name: string,
  label: string,
  icon?: string,
  options?: {
    min?: number;
    max?: number;
    useGrouping?: boolean;
    locale?: string;
    minFractionDigits?: number;
  }
  modelValue?: number
}>();

const { errorMessage, value } = useField<number>(toRef(props, 'name'), undefined, {
  syncVModel: true
});
</script>