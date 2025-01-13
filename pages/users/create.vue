<script setup lang="ts">
import { definePageMeta, useToast } from '#imports';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { object } from 'zod';
import { Button } from 'primevue';
import UserFormBasicFields from '~/components/user/form/UserFormBasicFields.vue';
import UserFormPassword from '~/components/user/form/UserFormPassword.vue';
import UserFormRole from '~/components/user/form/UserFormRole.vue';
import {
  BASIC_FIELDS,
  PASSWORDS_FIELDS,
  ROLE_FIELD
} from '~/utils/schemas/user';
import { UserService } from '~/services/user-service';

definePageMeta({
  middleware: ['auth-guard']
});

// Zod refine have some issues with Vee Validate, it only triggers when all the fields are completed
const validations = toTypedSchema(
  object({
    ...BASIC_FIELDS,
    ...PASSWORDS_FIELDS,
    ...ROLE_FIELD
  }).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no funcan',
    path: ['password_confirmation']
  })
);

const toast = useToast();
const { isSubmitting, handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: validations
});

const submit = handleSubmit(async (payload) => {
  const { data, error } = await new UserService().create(payload);

  if (error) {
    if (error.data?.errors.email) {
      setFieldError('email', 'El email ya está tomado');
    }
    if (error.data?.errors.role_id) {
      setFieldError('role_id', 'Rol inválido');
    }
    return;
  }

  toast.add({
    severity: 'success',
    summary: 'Nice',
    detail: `El usuario ${data?.name} ha sido creado correctamente`
  });

  resetForm();
});
</script>

<template>
  <form @submit.prevent="submit">
    <UserFormBasicFields />
    <UserFormPassword />
    <UserFormRole class="mb-2" />
    <Button type="submit" :loading="isSubmitting" label="Crear" />
  </form>
</template>

<style scoped></style>
