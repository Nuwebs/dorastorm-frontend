<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('general.login') }}</template>
        <template #content>
          <form @submit="onSubmit">
            <FormText name="email" :label="$t('forms.email')" type="email" placeholder="example@example.com"
              icon="pi pi-at" v-model="credentials.email" />
            <FormText name="password" :label="$t('forms.password')" type="password" icon="pi pi-lock"
              v-model="credentials.password" />
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
import { ref } from 'vue';
import { definePageMeta, navigateTo, useI18n, useLocalePath, useValidationLocales } from '#imports';
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
const credentials = ref<DsLoginCredentials>({
  email: '',
  password: ''
});

useValidationLocales();
const validations = object({
  email: string().required().email(),
  password: string().required()
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: validations
});

const onSubmit = handleSubmit(async () => {
  const response = await login(credentials.value);
  if (response) {
    if (response.statusCode === 422) {
      return setFieldError('email', response.data.errors.email);
    }
    return setFieldError("password", t("error.fatal"));
  }
  navigateTo(lp('/ds'));
})
</script>