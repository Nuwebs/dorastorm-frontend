<template>
  <section class="container py-8 grid grid-nogutter">
    <div class="col-4 flex justify-content-end">
      <i class="pi pi-map text-8xl mr-4"></i>
    </div>
    <div class="col-8 flex flex-column justify-content-center">
      <h1 class="m-0 text-2xl">{{ props.title? title :$t("error.404.default_title") }}</h1>
      <h3 class="m-0 text-color-secondary">{{ props.subtitle? subtitle : $t("error.404.default_resource") }}</h3>
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>