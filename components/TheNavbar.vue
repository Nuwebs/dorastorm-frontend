<template>
  <NavbarBase :content="guestNavbar()">
    <template #end>
      <NavbarButtonOptions :options="guestMenuOptions()" />
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import NavbarBase from './navbar/NavbarBase.vue';
import NavbarButtonOptions from './navbar/buttons/NavbarButtonOptions.vue';
import { guestMenuOptions, guestNavbar } from '~/services/menus';
</script>
