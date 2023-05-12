<template>
  <TheLoadingSpinner v-if="loading" />
  <TheDS404 v-else-if="is404" />
  <section class="p-container" v-if="!loading && role !== null">
    <h3 class="mb-2 mt-0">{{ $t("modules.roles.update") }}</h3>    
    <RoleFormContainer v-model="role" updating :submit-handler="submitHandler"/>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useAPIFetch, useGeneralErrorToast, useI18n, useRoute } from '#imports';
import PERMISSIONS from '~/utils/permissions';
import RoleFormContainer from '~/components/role/RoleFormContainer.vue';
import { ref, onMounted } from 'vue';
import { Role } from '~/types/dorastorm';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import TheDS404 from '~/components/TheDS404.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.ROLES_UPDATE]
});

const role = ref<Role | null>(null);
const loading = ref<boolean>(false);
const is404 = ref<boolean>(false);
const route = useRoute();
const toast = useToast();
const {t} = useI18n();

onMounted(async () => {
  loading.value = true;
  const {data, error} = await useAPIFetch<Role>({
    endpoint: `/roles/${route.params.id}`
  });
  if (error.value) is404.value = true;
  role.value = data.value;
  loading.value = false;
});

async function submitHandler() {
  const { error } = await useAPIFetch<void>({
    endpoint: "/roles/" + route.params.id,
    options: {
      method: "PATCH",
      body: role.value
    }
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  toast.add({
    severity: "success",
    detail: t("general.updated"),
    life: 3000
  });
}
</script>