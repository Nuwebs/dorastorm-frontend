<template>
  <nav class="shadow-1">
    <Menubar :model="items" class="py-3 px-6">
      <template #start>
        <h3 class="my-0 mr-4">Dorastorm</h3>
      </template>
      <template #end>
        <NuxtLink to="/login" class="nlink">
          Log in
        </NuxtLink>
      </template>
    </Menubar>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menubar from "primevue/menubar";

const items = ref([{
  label: 'Home',
  icon: 'pi pi-home',
  to: '/'
}])
</script>
<style scoped>
.p-menubar {
  border: 0;
}
</style>