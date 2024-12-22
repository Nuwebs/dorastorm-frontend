<script setup lang="ts">
import NavbarBase from './navbar/NavbarBase.vue';
import NavbarButtonOptions from './navbar/button/NavbarButtonOptions.vue';
</script>

<template>
  <NavbarBase :content="[]">
    <template #end>
      <NavbarButtonOptions :options="[]" />
    </template>
  </NavbarBase>
</template>

<style scoped></style>
