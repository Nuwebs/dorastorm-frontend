<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { array, object, string } from 'zod';
import RoleFormHierarchy from './RoleFormHierarchy.vue';
import RoleFormPermissions from './RoleFormPermissions.vue';
import FormText from '~/components/form/FormText.vue';
import FormTextArea from '~/components/form/FormTextArea.vue';
import UiButton from '~/components/ui/button/UiButton.vue';
import type { NewRole, Role } from '~/types/role';

interface Props {
  modelValue: Role | NewRole;
  submitHandler(): Promise<boolean>;
  updating?: boolean;
}

const props = defineProps<Props>();
const role = ref<Role | NewRole>(props.modelValue);

const validate = toTypedSchema(
  object({
    name: string().min(3),
    description: string().nullable(),
    permissions: array(string()).min(1)
  })
);

const { isSubmitting, handleSubmit, resetForm } = useForm({
  validationSchema: validate
});

const submit = handleSubmit(async () => {
  await props.submitHandler();
  if (!props.updating) {
    resetForm();
  }
});
</script>
<template>
  <div>
    <form @submit="submit">
      <FormText
        v-model="role.name"
        name="name"
        :label="$t('modules.roles.name')"
        type="text"
      />
      <FormTextArea
        v-model="role.description"
        name="description"
        :label="$t('modules.roles.description')"
      />
      <div class="grid grid-cols-12 gap-2 mt-3">
        <div class="col-span-12 md:col-span-8">
          <h3 class="mb-2 mt-0">
            {{ $t('modules.roles.select_permissions') }}
          </h3>
          <RoleFormPermissions v-model="role.permissions" name="permissions" />
        </div>
        <div class="col-span-12 md:col-span-4">
          <h3 class="mb-2 mt-0">
            {{ $t('modules.roles.select_hierarchy') }}
          </h3>
          <RoleFormHierarchy
            v-model="role.hierarchy"
            :updating="!!props.updating"
          />
        </div>
      </div>
      <UiButton :loading="isSubmitting" type="submit" class="mt-3">
        {{ $t('forms.submit') }}
      </UiButton>
    </form>
  </div>
</template>
