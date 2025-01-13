<script setup lang="ts">
import FormText from '~/components/form/FormText.vue';
</script>

<template>
  <div>
    <FormText name="password" label="Contraseña" type="password" />
    <FormText
      name="password_confirmation"
      label="Confirmar contraseña"
      type="password"
    />
  </div>
</template>

<style scoped></style>
