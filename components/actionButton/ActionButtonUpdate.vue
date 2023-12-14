<template>
  <Button icon="pi pi-pencil" text rounded aria-label="Update" @click="push" />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter, useLocalePath } from '#imports';

interface Props {
  route: string;
  modelId: number | string;
  modelIdReplace?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelIdReplace: '{id}'
});

if (!props.route.includes(props.modelIdReplace)) {
  // eslint-disable-next-line no-console
  console.error(
    `The route ${props.route} does not includes the replace key ${props.modelIdReplace}`
  );
}

const router = useRouter();
const lp = useLocalePath();

function push(): void {
  const r = props.route.replace(props.modelIdReplace, String(props.modelId));
  router.push(lp(r));
}
</script>
