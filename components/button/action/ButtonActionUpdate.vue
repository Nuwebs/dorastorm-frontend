<script setup lang="ts">
import { Button } from 'primevue';

interface Props {
  route: string;
  modelId: number | string;
  modelIdReplace?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelIdReplace: '{id}'
});

if (!props.route.includes(props.modelIdReplace)) {
  console.error(
    `The route ${props.route} does not includes the replace key ${props.modelIdReplace}`
  );
}
</script>

<template>
  <NuxtLinkLocale
    :to="route.replace(props.modelIdReplace, String(props.modelId))"
  >
    <Button icon="pi pi-pencil" text rounded aria-label="Update" />
  </NuxtLinkLocale>
</template>

<style scoped></style>
