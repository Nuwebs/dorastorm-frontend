<script setup lang="ts">
import NavbarButtonOptions from './navbar/button/NavbarButtonOptions.vue';
import NavbarBase from './navbar/NavbarBase.vue';
import useLocaleSwitchMenu from '~/composables/useLocaleSwitchMenu';

const localeMenu = useLocaleSwitchMenu();
</script>

<template>
  <NavbarBase :content="[]">
    <template #end>
      <NavbarButtonOptions
        :options="{
          label: $t('general.locales'),
          icon: 'pi pi-globe',
          items: localeMenu
        }"
      />
    </template>
  </NavbarBase>
</template>

<style scoped></style>
