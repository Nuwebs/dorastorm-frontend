import { computed, onMounted, onUnmounted, ref } from 'vue';

export default function useWindowWidth() {
  const windowWidth = ref<number>(window.innerWidth);

  function onWidthChange(): void {
    windowWidth.value = window.innerWidth;
  }

  // Adding the listeners
  onMounted(() => window.addEventListener('resize', onWidthChange));
  onUnmounted(() => window.removeEventListener('resize', onWidthChange));

  const width = computed<number>(() => windowWidth.value);

  return { width };
}
