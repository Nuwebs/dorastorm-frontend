<template>
  <NavbarBase :content="items">
    <template #start>
      <h3 class="my-0 mr-4">Dorastorm</h3>
    </template>
    <template #end>
      <NuxtLink to="/login" class="nlink">
        Log in
      </NuxtLink>
    </template>
  </NavbarBase>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavbarBase from "./navbar/NavbarBase.vue";

const items = ref([{
  label: 'Home',
  icon: 'pi pi-home',
  to: '/'
}])
</script>