<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
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
          icon: Globe,
          items: localeMenu
        }"
      />
    </template>
  </NavbarBase>
</template>

<style scoped></style>
