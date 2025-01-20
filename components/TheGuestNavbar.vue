<script setup lang="ts">
import NavbarButtonOptions from './navbar/button/NavbarButtonOptions.vue';
import NavbarBase from './navbar/NavbarBase.vue';
</script>

<template>
  <NavbarBase :content="[]">
    <template #end>
      <NavbarButtonOptions :options="[]" />
    </template>
  </NavbarBase>
</template>

<style scoped></style>
