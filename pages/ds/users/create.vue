<template>
  <section class="container">
    <h1 class="mt-0">{{ $t("modules.users.create") }}</h1>
    <form @submit="submit">
      <FormText name="name" type="text" :label="$t('modules.users.name')" placeholder="James Douglas" />
      <FormText name="email" type="email" :label="$t('forms.email')" placeholder="example@example.com" />
      <FormText name="password" type="password" :label="$t('forms.password')" />
      <FormText name="password_confirmation" type="password" :label="$t('forms.confirm_password')" />
      <FormSelect name="role_id" :label="$t('modules.users.role_select')" :options="availableRoles" option-label="name"
        option-value="id" :loading="loading" :placeholder="$t('modules.users.role_default')" />
      <Button :loading="isSubmitting" type="submit">{{ $t("forms.submit") }}</Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, useI18n, useSubmitHandler } from '#imports';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref, onMounted } from "vue";
import { object, string, number, ref as yupRef } from "yup";
import Button from 'primevue/button';
import FormText from '~/components/form/FormText.vue';
import { DsValidationErrorBag, Role } from '~/types/dorastorm';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import FormSelect from '~/components/form/FormSelect.vue';
import useAPIFetch from "~/composables/useAPIFetch";
import Permission from '~/utils/permissions';

definePageMeta({
  middleware: ["auth-guard"],
  permissions: [Permission.USERS_CREATE]
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

const validate = object({
  name: string().required().min(4).label(t("modules.users.name")),
  email: string().required().email().label(t("forms.email")),
  password: string().required().min(8).label(t("forms.password")),
  password_confirmation: string().required().oneOf(
    [yupRef('password')],
    t("error.validation.confirm_password")
  ).label(t("forms.confirm_password")),
  role_id: number().required().label(t("modules.users.role"))
})

const { handleSubmit, resetForm, isSubmitting, setFieldError } = useForm<NewUser>({
  validationSchema: validate,
  initialValues: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: undefined
  }
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

const submit = handleSubmit(async (payload) => {
  await useSubmitHandler<DsValidationErrorBag<NewUser>>(
    {
      endpoint: "/users",
      options: {
        method: "post",
        body: payload
      }
    },
    () => {
      toast.add({ severity: "success", detail: t("modules.users.created"), life: 3000 });
      resetForm();
    },
    (error) => {
      if (error.statusCode === 422 && error.data) {
        return setFieldError("email", error.data.errors.email);
      }
      return toast.add(useGeneralErrorToast());
    }
  );
});
</script>