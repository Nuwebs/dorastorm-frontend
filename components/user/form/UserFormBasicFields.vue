<script setup lang="ts">
import FormText from '~/components/form/FormText.vue';
</script>

<template>
  <div>
    <FormText name="name" :label="$t('modules.users.name')" type="text" />
    <FormText name="email" :label="$t('forms.email')" type="email" />
  </div>
</template>

<style scoped></style>
