<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import UiButton from '~/components/ui/button/UiButton.vue';

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
    <UiButton variant="outline" aria-label="Update">
      <Pencil />
    </UiButton>
  </NuxtLinkLocale>
</template>

<style scoped></style>
