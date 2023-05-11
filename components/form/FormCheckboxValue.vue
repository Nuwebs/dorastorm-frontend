<template>
  <div class="mb-1">
    <div class="flex align-items-center">
      <Checkbox :name="name" v-model="value" :class="{ 'p-invalid': errorMessage }" :value="props.content"/>
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
  content: string,
  modelValue?: string[]
}

const props = defineProps<Props>();

const { errorMessage, value } = useField<string[]>(toRef(props, 'name'));
</script>