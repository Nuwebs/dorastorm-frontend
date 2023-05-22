<template>
  <NavbarBase :content="items">
    <template #start>
      <h3 class="my-0 mr-4">Dorastorm</h3>
    </template>
    <template #end>
      <NavbarButtonOptions :options="guestMenuOptions()" />
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavbarBase from "./navbar/NavbarBase.vue";
import NavbarButtonOptions from "./navbar/buttons/NavbarButtonOptions.vue";
import { useI18n } from "#imports";
import { guestMenuOptions } from "~/services/menus";

const { t } = useI18n();

const items = ref([{
  label: t('general.home'),
  icon: 'pi pi-home',
  to: '/'
}]);
</script>