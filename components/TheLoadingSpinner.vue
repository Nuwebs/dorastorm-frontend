<template>
  <section class="loading-container">
    <div
      class="loading-overlay grid grid-nogutter justify-content-center flex-column align-items-center"
    >
      <div class="loading-spinner" />
      <div class="loading-text mt-2">
        {{ props.loadingText ? props.loadingText : $t('general.loading') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  loadingText?: string;
}>();
</script>

<style scoped>
.loading-container {
  position: relative;
  min-height: 50vh;
  width: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.loading-spinner {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top: 8px solid var(--primary-color);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-weight: bold;
  color: var(--text-color);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
