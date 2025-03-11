<script setup lang="ts">
import type { FetchError } from 'ofetch/node';
import { ref } from 'vue';
import { useAsyncData } from '#imports';
import FormSelect from '~/components/form/FormSelect.vue';
import FormText from '~/components/form/FormText.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import { useUserForm, type FormMode } from '~/composables/useUserForm';
import { UserService } from '~/services/user-service';
import type { LaravelValidationErrorBag } from '~/types/dorastorm';
import type { Role } from '~/types/role';
import type { NewUser, User } from '~/types/user';

type UserFormError = FetchError<
  LaravelValidationErrorBag<Partial<User> | NewUser>
>;

// Define props with strict typing
const props = defineProps<{
  mode: FormMode;
  initialData?: Partial<User>;
}>();
const emit = defineEmits<{
  success: [payload: User];
  error: [error: UserFormError];
}>();

// Use the composable with typed return
const {
  name,
  email,
  password,
  password_confirmation,
  role_id,

  fields,
  isSubmitting,
  //errors,
  setFieldError,
  onSubmit
} = useUserForm(props.mode, props.initialData);

if (props.initialData?.role) {
  role_id.value = props.initialData.role.id;
}

// Fetch roles for admin forms
const roles = ref<Role[]>([]);
if (props.mode === 'admin-create' || props.mode === 'admin-update') {
  const userService = new UserService();
  const { data } = await useAsyncData(() => userService.getRolesBelow());

  roles.value = data.value ?? [];
}

async function handleSubmit() {
  const submitResult = await onSubmit();
  if (submitResult === undefined) return;

  if (submitResult.payload) {
    return emit('success', submitResult.payload);
  }

  if (submitResult.error) {
    const error = submitResult.error as UserFormError;
    if (error.data) {
      for (const [key, value] of Object.entries(error.data.errors)) {
        setFieldError(key as keyof NewUser, value);
      }
    } else {
      return emit('error', error);
    }
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <FormText
      v-if="fields.name.visible"
      v-model="name"
      name="name"
      :label="$t('modules.users.name')"
      type="text"
    />

    <FormText
      v-if="fields.email.visible"
      v-model="email"
      name="email"
      :label="$t('forms.email')"
      type="email"
    />

    <FormText
      v-if="fields.password.visible"
      v-model="password"
      name="password"
      :label="$t('forms.password')"
      type="password"
    />
    <FormText
      v-if="fields.password_confirmation.visible"
      v-model="password_confirmation"
      name="password_confirmation"
      :label="$t('forms.confirm_password')"
      type="password"
    />

    <FormSelect
      v-if="fields.role_id.visible"
      v-model="role_id"
      name="role_id"
      :label="$t('modules.users.role')"
      :options="roles"
      option-value="id"
      option-label="name"
    />

    <UiButton type="submit" :loading="isSubmitting" class="mt-4">
      {{ $t('forms.submit') }}
    </UiButton>
  </form>
</template>
