<template>
  <div class="mb-2">
    <label :for="name">{{ label }}</label>
    <div class="p-inputgroup flex-1">
      <span class="p-inputgroup-addon" v-if="icon"><i :class="icon"></i></span>
      <InputText :name="name" :type="type" :placeholder="placeholder ? placeholder : undefined" v-model="value"
        :class="{ 'p-invalid': errorMessage }" />
    </div>
    <ErrorMessage :name="name" class="p-error" />
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';
import InputText from 'primevue/inputtext';

const props = defineProps<{
  name: string,
  label: string,
  type: string,
  placeholder?: string,
  icon?: string,
  modelValue?: string
}>();

const { errorMessage, value } = useField<string>(toRef(props, 'name'));
</script>