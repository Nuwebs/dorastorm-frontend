<script setup lang="ts">
import { Settings } from 'lucide-vue-next';
import NavbarButtonOptions from './navbar/button/NavbarButtonOptions.vue';
import NavbarBase from './navbar/NavbarBase.vue';
import useAuthenticatedContextMenu from '~/composables/useAuthenticatedContextMenu';

const { processed } = useAuthenticatedContextMenu();
</script>
<template>
  <NavbarBase>
    <template #end>
      <NavbarButtonOptions
        :options="{
          icon: Settings,
          items: processed
        }"
      />
    </template>
  </NavbarBase>
</template>
