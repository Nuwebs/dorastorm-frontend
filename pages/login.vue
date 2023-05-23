<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('general.login') }}</template>
        <template #content>
          <form @submit="onSubmit">
            <FormText name="email" :label="$t('forms.email')" type="email" placeholder="example@example.com"
              icon="pi pi-at" />
            <FormText name="password" :label="$t('forms.password')" type="password" icon="pi pi-lock" />
            <Button type="submit" class="w-full justify-content-center mb-2" :loading="isSubmitting">
              {{ $t('forms.submit') }}</Button>
            <Hr />
            <NuxtLink :to="lp('/forgot-password')" class="nlink">{{ $t('forms.forgot_password') }}</NuxtLink>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { definePageMeta, navigateTo, useI18n, useLocalePath } from '#imports';
import { login } from '~/services/auth';
import { DsLoginCredentials } from '~/types/dorastorm';
import Card from "primevue/card";
import Button from "primevue/button";
import Hr from '~/components/Hr.vue';
import FormText from '~/components/form/FormText.vue';
import { useForm } from "vee-validate";
import { object, string } from "yup";

definePageMeta({
  middleware: ['guest-guard']
});
const lp = useLocalePath();
const { t } = useI18n();

const validations = object({
  email: string().required().email().label(t("forms.email")),
  password: string().required().label(t("forms.password"))
});

const { handleSubmit, isSubmitting, setFieldError } = useForm<DsLoginCredentials>({
  validationSchema: validations
});

const onSubmit = handleSubmit(async (payload) => {
  const response = await login(payload);
  if (response) {
    if (response.statusCode === 422) {
      return setFieldError('email', response.data.errors.email);
    }
    return setFieldError("password", t("error.fatal"));
  }
  navigateTo(lp('/ds'));
})
</script>