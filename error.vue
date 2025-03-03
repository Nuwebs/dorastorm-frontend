<script setup lang="ts">
import UiButton from './components/ui/button/UiButton.vue';
import { clearError, type NuxtError } from '#app';

defineProps({
  error: Object as () => NuxtError
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout name="error">
    <div
      class="flex flex-col items-center justify-center min-h-screen text-gray-800"
    >
      <div
        class="bg-white shadow-md rounded-lg p-8 sm:min-w-96 max-w-lg text-center"
      >
        <template v-if="error">
          <h2 class="text-6xl font-bold text-red-500">
            {{ error?.statusCode }}
          </h2>
          <h3 class="text-2xl font-semibold mt-4">
            {{ error?.statusMessage }}
          </h3>
        </template>
        <p v-else class="text-gray-600 mt-2">
          {{ $t('error.fatal') }}
        </p>
        <UiButton variant="destructive" class="mt-6" @click="handleError">
          {{ $t('general.home') }}
        </UiButton>
      </div>
    </div>
  </NuxtLayout>
</template>
