<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <div class="p-inputgroup flex-1">
      <span v-if="icon" class="p-inputgroup-addon"><i :class="icon" /></span>
      <InputMask
        v-model="value"
        :name="name"
        :mask="format"
        :placeholder="placeholder"
        :class="{ 'p-invalid': errorMessage }"
      />
    </div>
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';
import InputMask from 'primevue/inputmask';

interface Props {
  name: string;
  label: string;
  icon?: string;
  modelValue?: string | null;
  format?: string;
  placeholder?: string;
}
const props = withDefaults(defineProps<Props>(), {
  format: '9999999999',
  placeholder: '3184301032'
});

const { errorMessage, value } = useField<string>(
  toRef(props, 'name'),
  undefined,
  {
    syncVModel: true
  }
);
</script>
