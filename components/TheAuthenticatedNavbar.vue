<script setup lang="ts">
import NavbarBase from './navbar/NavbarBase.vue';
import NavbarButtonOptions from './navbar/button/NavbarButtonOptions.vue';
import useAuthenticatedContextMenu from '~/composables/useAuthenticatedContextMenu';

const { processed } = useAuthenticatedContextMenu();
</script>
<template>
  <NavbarBase>
    <template #start>
      <div />
    </template>
    <template #end>
      <NavbarButtonOptions :options="processed" />
    </template>
  </NavbarBase>
</template>
