<template>
  <section class="mt-3">
    <Button class="mb-2" @click="toggle = !toggle" severity="warning" v-if="!toggle">{{
      $t("modules.users.change_password") }}</Button>
    <form @submit="submit" v-show="toggle">
      <FormText name="current_password" type="password" :label="$t('forms.current_password')" />
      <FormText name="password" type="password" :label="$t('forms.password')" />
      <FormText name="password_confirmation" type="password" :label="$t('forms.confirm_password')" />
      <Button class="mr-2" :loading="isSubmitting" severity="secondary" @click="toggle = !toggle">{{ $t("general.cancel")
      }}</Button>
      <Button :loading="isSubmitting" type="submit">{{ $t("modules.users.change_password") }}</Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref } from "vue";
import { object, string, ref as yupRef } from "yup";
import Button from 'primevue/button';
import FormText from '~/components/form/FormText.vue';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import { useI18n } from '#imports';
import useAPIFetch from "~/composables/useAPIFetch";

interface NewPassword {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const props = defineProps<{
  userId: number | string
}>();

const toast = useToast();
const { t } = useI18n();
const toggle = ref<boolean>(false);
const validate = object({
  current_password: string().required().min(8).label(t("forms.current_password")),
  password: string().required().min(8).label(t("forms.password")),
  password_confirmation: string().required().oneOf(
    [yupRef('password')],
    t("error.validation.confirm_password")
  ).label(t("forms.confirm_password"))
})

const { isSubmitting, handleSubmit, setFieldError, resetForm } = useForm<NewPassword>({
  validationSchema: validate,
  initialValues: {
    current_password: "",
    password: "",
    password_confirmation: ""
  }
});

const submit = handleSubmit(async (payload) => {
  const { error } = await useAPIFetch({
    endpoint: `/users/${props.userId}/password`,
    options: {
      method: "PATCH",
      body: payload
    }
  });
  if (error.value) {
    if (error.value.statusCode === 422) {
      return setFieldError("current_password", t("error.validation.current_password"));
    }
    return toast.add(useGeneralErrorToast());
  }
  toast.add({ severity: "success", detail: t("modules.users.password_changed"), life: 3000 });
  resetForm();
})
</script>