<template>
  <Button icon="pi pi-trash" text rounded aria-label="Delete" severity="danger" @click="confirmDialog"
    :loading="loading" />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { ref } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { useFetch, useI18n } from '#imports';
import use404Toast from "~/composables/use404Toast";
import use403Toast from "~/composables/use403Toast";
import useGeneralErrorToast from "~/composables/useGeneralErrorToast";
import useAPIFetch from "~/composables/useAPIFetch";

interface Props {
  endpoint: string;
  modelId: number | string;
  cdMessages: {
    message: string;
    header: string;
  }
  modelIdReplace?: string;
  options?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelIdReplace: "{id}",
});

const emit = defineEmits<{
  (event: "deleted", id: number | string): void
}>();

if (!props.endpoint.includes(props.modelIdReplace)) {
  console.error(`The endpoint ${props.endpoint} does not includes the replace key ${props.modelIdReplace}`);
}

const confirm = useConfirm();
const toast = useToast();
const loading = ref<boolean>(false);
const { t } = useI18n();

function confirmDialog(): void {
  confirm.require({
    message: props.cdMessages.message,
    header: props.cdMessages.header,
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    acceptIcon: "pi pi-trash",
    acceptLabel: t("general.delete"),
    rejectLabel: t("general.cancel"),
    accept: () => deleteModel()
  })
}

async function deleteModel(): Promise<void> {
  loading.value = true;
  const ep = props.endpoint.replace(props.modelIdReplace, String(props.modelId));
  const { error } = await useAPIFetch({
    endpoint: ep,
    options: !props.options ? {
      method: "delete"
    } : props.options
  });
  loading.value = false;
  if (!error.value) {
    return emit("deleted", props.modelId);
  }
  switch (error.value.statusCode) {
    case 403:
      toast.add(use403Toast());
      break;
    case 404:
      toast.add(use404Toast());
      break;
    case 409:
      toast.add({ severity: "error", detail: t("error.409.specific.last_admin"), life: 3000 });
      break;
    default:
      toast.add(useGeneralErrorToast());
      break;
  }
}
</script>