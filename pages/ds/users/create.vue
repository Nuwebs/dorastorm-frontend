<template>
  <section class="p-container">
    <h1 class="mt-0">{{ $t("modules.users.create") }}</h1>
    <form @submit="submit">
      <FormText name="name" type="text" :label="$t('modules.users.name')" v-model="data.name"
        placeholder="James Douglas" />
      <FormText name="email" type="email" :label="$t('forms.email')" v-model="data.email"
        placeholder="example@example.com" />
      <FormText name="password" type="password" :label="$t('forms.password')" v-model="data.password" />
      <FormText name="password_confirmation" type="password" :label="$t('forms.confirm_password')"
        v-model="data.password_confirmation" />
      <FormSelect name="role_id" :label="$t('modules.users.role_select')" :options="availableRoles" option-label="name"
        option-value="id" :loading="loading" :placeholder="$t('modules.users.role_default')" v-model="data.role_id" />
      <Button :loading="isSubmitting" type="submit">{{ $t("forms.submit") }}</Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n } from '#imports';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref, onMounted } from "vue";
import { object, string, number, ref as yupRef } from "yup";
import Button from 'primevue/button';
import FormText from '~/components/form/FormText.vue';
import { Role } from '~/types/dorastorm';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import FormSelect from '~/components/form/FormSelect.vue';
import useAPIFetch from "~/composables/useAPIFetch";
import { PERMISSIONS } from '~/services/permissions';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [PERMISSIONS.USERS_CREATE]
});

interface NewUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

const toast = useToast();
const { t } = useI18n();
const loading = ref<boolean>(false);
const availableRoles = ref<Role[]>([]);
const data = ref<NewUser>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role_id: -1
});

const validate = object({
  name: string().required().min(4),
  email: string().required().email(),
  password: string().required().min(8),
  password_confirmation: string().required().oneOf(
    [yupRef('password')],
    t("error.validation.confirm_password")
  ),
  role_id: number().required()
})

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: validate
});

onMounted(async () => {
  loading.value = true;
  const { data, error } = await useAPIFetch<Role[]>({
    endpoint: "/users/rolesbelow"
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  loading.value = false;
  availableRoles.value = data.value!;
});

const submit = handleSubmit(async () => {
  const { error } = await useAPIFetch({
    endpoint: "/users",
    options: {
      method: "post",
      body: data.value
    }
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  toast.add({ severity: "success", detail: t("modules.users.created"), life: 3000 });
  resetForm();
});

</script>