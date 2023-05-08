<template>
  <section class="grid-nogutter flex flex-column justify-content-center py-8">
    <div class="col-12 md:col-4 md:col-offset-4">
      <Card>
        <template #title>
          {{ $t('forms.forgot_password') }}
        </template>
        <template #content>
          <form @submit="onSubmit">
            <FormText name="email" type="email" :label="$t('forms.email')" v-model="data.email" />
            <Button type="submit" class="w-full justify-content-center" :loading="isSubmitting">{{ $t('forms.submit')
            }}</Button>
          </form>
        </template>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import { ref } from "vue";
import FormText from "~/components/form/FormText.vue";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import Button from "primevue/button";
import { definePageMeta, useI18n } from "#imports";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import useAPIFetch from "~/composables/useAPIFetch";

definePageMeta({
  middleware: ['guest-guard']
});

const data = ref({
  email: ''
});
const toast = useToast();
const { t } = useI18n();

const validate = object({
  email: string().required().email()
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: validate
});

// Replace fetch with useFetch implementation when useFetch type bug is fixed
const onSubmit = handleSubmit(async () => {
  const { error } = await useAPIFetch<void>({
    endpoint: "forgot-password",
    auth: false,
    options: {
      method: "post",
      body: data.value
    }
  });
  if (error.value) {
    if (error.value.statusCode === 422) {
      return setFieldError("email", t("error.validation.email_404"));
    }
    return setFieldError("password", t("error.fatal"));
  }
  toast.add({
    severity: "success",
    detail: t("modules.users.fp_email_send"),
    life: 3000
  });
});
</script>