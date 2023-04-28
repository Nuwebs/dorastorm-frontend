<template>
  <NavbarBase :content="items">
    <template #start>
      <h3 class="my-0 mr-4">Dorastorm</h3>
    </template>
    <template #end>
      <NuxtLink :to="lp('/login')" class="nlink">
        {{ $t("general.login") }}
      </NuxtLink>
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavbarBase from "./navbar/NavbarBase.vue";
import { useI18n, useLocalePath } from "#imports";

const lp = useLocalePath();
const {t} = useI18n();

const items = ref([{
  label: t('general.home'),
  icon: 'pi pi-home',
  to: '/'
}])
</script>