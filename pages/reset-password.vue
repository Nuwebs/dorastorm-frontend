<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('forms.reset_password') }}
        </template>
        <template #content>
          <form @submit="submit">
            <FormText name="password" type="password" :label="$t('forms.password')" v-model="data.password" />
            <FormText name="password_confirmation" type="password" :label="$t('forms.confirm_password')"
              v-model="data.password_confirmation" />
            <Button type="submit" class="w-full justify-content-center" :loading="isSubmitting">{{ $t('forms.submit')
            }}</Button>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { navigateTo, useRoute } from 'nuxt/app';
import { definePageMeta, useI18n, useSubmitHandler } from '#imports';
import { ref } from "vue";
import { useForm } from "vee-validate";
import { object, string, ref as yupRef } from "yup";
import { useToast } from "primevue/usetoast";
import Button from 'primevue/button';
import Card from 'primevue/card';

definePageMeta({
  middleware: ['guest-guard']
});

const route = useRoute();
const toast = useToast();
const { t } = useI18n();

// Prevent for entering this page if it isn't a token and email present.
if (process.client) {
  if (!(route.query.token && route.query.email)) navigateTo('/forgot-password');
}

const data = ref({
  email: route.query.email,
  token: route.query.token,
  password: '',
  password_confirmation: ''
});

const validate = object({
  password: string().required().min(8).label(t("forms.password")),
  password_confirmation: string().required().oneOf(
    [yupRef('password')],
    t("error.validation.confirm_password")
  )
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validate
});

const submit = handleSubmit(async () => useSubmitHandler(
  {
    endpoint: "/reset-password",
    auth: false,
    options: {
      method: "post",
      body: data.value
    }
  },
  () => {
    toast.add({ severity: 'success', detail: t("modules.users.password_changed"), life: 3000 });
    navigateTo('/login');
  },
  (error) => {
    if (error.statusCode === 422) {
      return toast.add({ severity: 'error', detail: t("error.validation.reset_password"), life: 3000 });
    }
    return toast.add({ severity: 'error', detail: t("error.fatal"), life: 3000 });
  }
));
</script>