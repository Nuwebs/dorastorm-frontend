<script setup lang="ts">
import FormText from '~/components/form/FormText.vue';
</script>

<template>
  <div>
    <FormText name="password" :label="$t('forms.password')" type="password" />
    <FormText
      name="password_confirmation"
      :label="$t('forms.confirm_password')"
      type="password"
    />
  </div>
</template>

<style scoped></style>
