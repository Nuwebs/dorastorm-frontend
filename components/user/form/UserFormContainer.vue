<script setup lang="ts">
import { Button } from 'primevue';
import UserFormBasicFields from '~/components/user/form/UserFormBasicFields.vue';
import UserFormPassword from '~/components/user/form/UserFormPassword.vue';
import UserFormRole from '~/components/user/form/UserFormRole.vue';
import useCachedPermissions from '~/composables/useCachedPermissions';
import { PERMISSION } from '~/services/permission-service';
import { object } from 'zod';
import {
  BASIC_FIELDS,
  PASSWORDS_FIELDS,
  ROLE_FIELD
} from '~/utils/schemas/user';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import type { BaseUser, User } from '~/types/user';
import type { FetchedResponse } from '~/types/fetch';
import type { FetchError } from 'ofetch/node';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import { useI18n } from '#imports';

/**
 * Basic
 * Admin: It includes all fields.
 * Regular: For registration forms. It includes basic data + password confirmation
 * Updating: For all registered users. It includes basic data + roles (if they have the permission)
 */

const MODE = {
  ADMIN: 'admin',
  REGULAR: 'regular',
  UPDATE: 'update'
} as const;

type Mode = (typeof MODE)[keyof typeof MODE];

const props = defineProps<{
  mode: Mode;
  initialData?: User;
  submitHandler(payload: unknown): Promise<FetchedResponse<unknown, unknown>>;
}>();

const emit = defineEmits<{
  success: [data: unknown];
  error: [error: FetchError<LaravelValidationErrorBag<unknown>>];
}>();

const { t } = useI18n();

const { userCan } = useCachedPermissions([PERMISSION.USERS_UPDATE]);
const includePasswordFields = props.mode !== MODE.UPDATE;
const includeRoleFields =
  props.mode !== MODE.REGULAR && userCan(PERMISSION.USERS_UPDATE);

const validationSchema = object({
  ...BASIC_FIELDS,
  ...(includePasswordFields && PASSWORDS_FIELDS),
  ...(includeRoleFields && ROLE_FIELD)
});

let formInitialData: (BaseUser & { role_id: number }) | undefined = undefined;
if (props.initialData) {
  formInitialData = {
    ...props.initialData,
    role_id: props.initialData.role.id
  };
}

const { isSubmitting, handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: toTypedSchema(
    // If the schema includes passwoird fields, the refine method is required.
    !includePasswordFields
      ? validationSchema
      : validationSchema.refine(
          (data) => data.password === data.password_confirmation,
          {
            message: t('error.validation.confirm_password'),
            path: ['password_confirmation']
          }
        )
  ),
  initialValues: formInitialData
});

const submit = handleSubmit(async (payload) => {
  const { data, error } = await props.submitHandler(payload);
  const typedError = error as FetchError<
    LaravelValidationErrorBag<typeof payload>
  >;
  if (typedError) {
    if (typedError.data) {
      for (const [key, value] of Object.entries(typedError.data.errors)) {
        setFieldError(key, value);
      }
    } else {
      emit('error', typedError);
    }
    return;
  }

  emit('success', data);
  if (props.mode !== MODE.UPDATE) resetForm();
});
</script>

<template>
  <form @submit.prevent="submit">
    <UserFormBasicFields />
    <UserFormPassword v-if="includePasswordFields" />
    <UserFormRole v-if="includeRoleFields" />
    <Button
      type="submit"
      :loading="isSubmitting"
      :label="
        mode === MODE.UPDATE
          ? $t('modules.users.update')
          : $t('modules.users.create')
      "
      class="mt-3"
    />
  </form>
</template>

<style scoped></style>
