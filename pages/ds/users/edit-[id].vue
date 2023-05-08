<template>
  <TheLoadingSpinner v-if="loading" />
  <TheDS404 v-else-if="is404" :subtitle="$t('error.404.specific.user')" />
  <section v-else class="p-container">
    <h1 class="mt-0">{{ $t("modules.users.user_info") }}</h1>
    <form @submit="submit" class="mb-3">
      <FormText name="name" type="text" :label="$t('modules.users.name')" v-model="data.name"
        placeholder="James Douglas" />
      <FormText name="email" type="email" :label="$t('forms.email')" v-model="data.email"
        placeholder="example@example.com" />
      <FormSelect name="role_id" :label="$t('modules.users.role_select')" :options="availableRoles" option-label="name"
        option-value="id" :placeholder="$t('modules.users.role_default')" v-model="data.role_id" />
      <Button :loading="isSubmitting" type="submit">{{ $t("forms.submit") }}</Button>
    </form>
    <Hr />
    <UserChangePassword :user-id="Number(route.params.id)" />
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useRoute } from '#imports';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref, onMounted } from "vue";
import { object, string, number } from "yup";
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import TheDS404 from '~/components/TheDS404.vue';
import { Role, User } from '~/types/dorastorm';
import Button from 'primevue/button';
import FormText from '~/components/form/FormText.vue';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import Hr from '~/components/Hr.vue';
import UserChangePassword from '~/components/user/UserChangePassword.vue';
import useAPIFetch from "~/composables/useAPIFetch";

definePageMeta({
  middleware: ["auth-guard"],
  permissions: ["users-update", "users-read"]
});

interface UpdateUser {
  name: string;
  email: string;
  role_id: number;
}
const { t } = useI18n();
const route = useRoute();
const toast = useToast();

const loading = ref<boolean>(false);
const is404 = ref<boolean>(false);

const availableRoles = ref<Role[]>([]);
const data = ref<UpdateUser>({
  name: "",
  email: "",
  role_id: -1
});

const validate = object({
  name: string().required().min(4),
  email: string().required().email(),
  role_id: number().required()
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validate
});

async function fetchUser() {
  const { data: user, error } = await useAPIFetch<User>({
    endpoint: "/users/" + route.params.id
  });
  if (error.value) {
    return error.value;
  }
  data.value = {
    name: user.value!.name,
    email: user.value!.email,
    role_id: user.value!.role.id
  };
}

async function fetchRoles() {
  const { data, error } = await useAPIFetch<Role[]>({
    endpoint: "/users/rolesbelow"
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  availableRoles.value = data.value!;
}

onMounted(async () => {
  loading.value = true;
  const eu = await fetchUser();
  if (eu) return is404.value = true;
  await fetchRoles();
  loading.value = false;
});

const submit = handleSubmit(async () => {
  const { error } = await useAPIFetch({
    endpoint: "/users/" + route.params.id,
    options: {
      method: "PATCH",
      body: data.value
    }
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  toast.add({ severity: "success", detail: t("general.updated"), life: 3000 });
})
</script>