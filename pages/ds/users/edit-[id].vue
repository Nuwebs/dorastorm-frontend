<template>
  <TheLoadingSpinner v-if="loading" />
  <TheDS404 v-else-if="is404" :subtitle="$t('error.404.specific.user')" />
  <section v-else class="container">
    <h1 class="mt-0">
      {{ $t('modules.users.user_info') }}
    </h1>
    <form class="mb-3" @submit="submit">
      <FormText
        v-model="data.name"
        name="name"
        type="text"
        :label="$t('modules.users.name')"
        placeholder="James Douglas"
      />
      <FormText
        v-model="data.email"
        name="email"
        type="email"
        :label="$t('forms.email')"
        placeholder="example@example.com"
      />
      <FormSelect
        v-if="shouldIncludeRole"
        v-model="data.role_id"
        name="role_id"
        :label="$t('modules.users.role_select')"
        :options="availableRoles"
        option-label="name"
        option-value="id"
        :placeholder="$t('modules.users.role_default')"
      />
      <Button :loading="isSubmitting" type="submit">
        {{ $t('forms.submit') }}
      </Button>
    </form>
    <Divider />
    <UserChangePassword :user-id="Number(route.params.id)" />
  </section>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { ref, onMounted } from 'vue';
import { object, string, number } from 'yup';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import TheLoadingSpinner from '~/components/TheLoadingSpinner.vue';
import TheDS404 from '~/components/TheDS404.vue';
import { DsValidationErrorBag, Role, User } from '~/types/dorastorm';
import {
  definePageMeta,
  useCachedPermissions,
  useI18n,
  useRoute,
  useSubmitHandler
} from '#imports';
import FormText from '~/components/form/FormText.vue';
import useGeneralErrorToast from '~/composables/useGeneralErrorToast';
import UserChangePassword from '~/components/user/UserChangePassword.vue';
import useAPIFetch from '~/composables/useAPIFetch';
import Permission from '~/utils/permissions';
import useAuthStore from '~/stores/authStore';
import { getUserInfo } from '~/services/auth';

definePageMeta({
  middleware: ['auth-guard'],
  permissions: [Permission.USERS_UPDATE],
  bailSelf: true
});

interface UpdateUser {
  name: string;
  email: string;
  role_id: number;
}
const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const { userCan } = useCachedPermissions([Permission.USERS_UPDATE]);
const authStore = useAuthStore();

const loading = ref<boolean>(false);
const is404 = ref<boolean>(false);

const availableRoles = ref<Role[]>([]);
const data = ref<UpdateUser>({
  name: '',
  email: '',
  role_id: -1
});

const roleIdValidation = {
  role_id: number().required().label(t('modules.users.role'))
};
const updatingSelf: boolean = Number(route.params.id) === authStore.user!.id;
const shouldIncludeRole = ref<boolean>(
  !updatingSelf || userCan(Permission.USERS_UPDATE)
);

const validate = object({
  name: string().required().min(4).label(t('modules.users.name')),
  email: string().required().email().label(t('forms.email')),
  ...(shouldIncludeRole.value && roleIdValidation)
});

const { handleSubmit, isSubmitting, setFieldError } = useForm({
  validationSchema: validate
});

async function fetchUser() {
  const { data: user, error } = await useAPIFetch<User>({
    endpoint: '/users/' + route.params.id
  });
  if (error.value) {
    return error.value;
  }
  data.value = {
    name: user.value!.name,
    email: user.value!.email,
    role_id: user.value!.role.id
  };
}

async function fetchRoles() {
  const { data, error } = await useAPIFetch<Role[]>({
    endpoint: '/users/rolesbelow'
  });
  if (error.value) {
    return toast.add(useGeneralErrorToast());
  }
  availableRoles.value = data.value!;
}

onMounted(async () => {
  loading.value = true;
  const eu = await fetchUser();
  if (eu) {
    is404.value = true;
    return;
  }
  if (shouldIncludeRole.value) {
    await fetchRoles();
  }
  loading.value = false;
});

const submit = handleSubmit(
  async () =>
    await useSubmitHandler<DsValidationErrorBag<User>>(
      {
        endpoint: '/users/' + route.params.id,
        options: {
          method: 'PATCH',
          body: data.value
        }
      },
      async () => {
        if (updatingSelf) {
          await getUserInfo();
        }
        toast.add({
          severity: 'success',
          detail: t('general.updated'),
          life: 3000
        });
      },
      (error) => {
        if (error.data && error.statusCode === 422) {
          return setFieldError('email', error.data.errors.email);
        }
        if (error.data && error.statusCode === 409) {
          return setFieldError('role_id', error.data.message);
        }
        toast.add(useGeneralErrorToast());
      }
    )
);
</script>
