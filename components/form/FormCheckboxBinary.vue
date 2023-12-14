<template>
  <div class="mb-1">
    <div class="flex align-items-center">
      <Checkbox v-model="value" :name="name" :class="{ 'p-invalid': errorMessage }" binary />
      <label :for="name" class="ml-1">{{ label }}</label>
    </div>
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import { toRef } from 'vue';
import { useField } from 'vee-validate';

interface Props {
  name: string,
  label: string,
  modelValue?: boolean
}

const props = defineProps<Props>();

const { errorMessage, value } = useField<boolean>(toRef(props, 'name'), undefined, {
  syncVModel: true
});
</script>
