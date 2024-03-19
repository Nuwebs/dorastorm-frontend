<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import { object, string, array, ObjectSchema, number } from 'yup';
import { useForm } from 'vee-validate';
import FormText from '../form/FormText.vue';
import FormTextArea from '../form/FormTextArea.vue';
import RoleFormPermissions from './RoleFormPermissions.vue';
import RoleFormHierarchy from './RoleFormHierarchy.vue';
import type { Role, NewRole } from '~/types/dorastorm';
import { useI18n } from '#imports';
import type Permission from '~/utils/permissions';

interface Props {
  modelValue: Role | NewRole;
  submitHandler(): Promise<boolean>;
  updating?: boolean;
}

const props = defineProps<Props>();
const role = ref<Role | NewRole>(props.modelValue);
const { t } = useI18n();

const validate: ObjectSchema<NewRole> = object({
  name: string().required().defined().min(3).label(t('modules.roles.name')),
  description: string()
    .required()
    .defined()
    .label(t('modules.roles.description')),
  permissions: array()
    .of(string<Permission>().required().defined())
    .required()
    .min(1, t('error.422.specific.role_permissions'))
    .label(t('modules.roles.select_permissions')),
  hierarchy: number().required().defined()
});

const { isSubmitting, handleSubmit } = useForm({
  validationSchema: validate
});

const submit = handleSubmit(props.submitHandler);
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
      <div class="grid">
        <div class="col-12 md:col-8">
          <h3 class="mb-2 mt-0">
            {{ $t('modules.roles.select_permissions') }}
          </h3>
          <RoleFormPermissions v-model="role.permissions" name="permissions" />
        </div>
        <div class="col-12 md:col-4">
          <h3 class="mb-2 mt-0">
            {{ $t('modules.roles.select_hierarchy') }}
          </h3>
          <RoleFormHierarchy
            v-model="role.hierarchy"
            name="hierarchy"
            :updating="!!props.updating"
          />
        </div>
      </div>
      <Button :loading="isSubmitting" type="submit">
        {{ $t('forms.submit') }}
      </Button>
    </form>
  </div>
</template>
