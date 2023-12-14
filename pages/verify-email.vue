<template>
  <TheLoadingSpinner v-if="loading" />
  <section v-if="!loading" class="container">
    <div class="mt-4 grid border-1 border-round surface-border surface-section">
      <div class="col-3 flex justify-content-center">
        <i v-if="worked" class="pi pi-check-circle text-8xl mr-4 text-green-500" />
        <i v-if="!worked" class="pi pi-times-circle text-8xl mr-4 text-red-500" />
      </div>
      <div class="col-9 flex flex-column justify-content-center align-content-center">
        <h1 v-if="worked" class="m-0 text-green-500">
          {{ $t("modules.users.email_verified") }}
        </h1>
        <div v-if="!worked">
          <h1 class="m-0 text-red-500">
            {{ $t("modules.users.email_verified_failed") }}
          </h1>
          <p class="m-0 text-red-400">
            {{ $t("modules.users.email_verified_failed_text") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { navigateTo, useLocalePath, useRoute } from '#imports';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';

const route = useRoute();
const lp = useLocalePath();
const loading = ref<boolean>(true);
const worked = ref<boolean>(false);

onMounted(async () => {
  if (!(route.query && route.query.api)) {
    await navigateTo(lp('/login'));
  }
  loading.value = true;
  try {
    await $fetch(route.query.api as string);
    worked.value = true;
  } catch {
    worked.value = false;
  }
  loading.value = false;
});
</script>
