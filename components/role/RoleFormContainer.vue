<template>
  <div>
    <form @submit="submit">
      <FormText v-model="role.name" name="name" :label="$t('modules.roles.name')" type="text" />
      <FormTextArea v-model="role.description" name="description" :label="$t('modules.roles.description')" />
      <div class="grid">
        <div class="col-12 md:col-8">
          <h3 class="mb-2 mt-0">{{ $t("modules.roles.select_permissions") }}</h3>
          <RoleFormPermissions v-model="role.permissions" />
        </div>
        <div class="col-12 md:col-4">
          <h3 class="mb-2 mt-0">{{ $t("modules.roles.select_hierarchy") }}</h3>
          <RoleFormHierarchy v-model="role.hierarchy" :updating="!!props.updating" />
        </div>
      </div>
      <Button :loading="isSubmitting" type="submit">{{ $t("forms.submit") }}</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Role, NewRole } from '~/types/dorastorm';
import FormText from '../form/FormText.vue';
import FormTextArea from '../form/FormTextArea.vue';
import Button from 'primevue/button';
import RoleFormPermissions from './RoleFormPermissions.vue';
import RoleFormHierarchy from './RoleFormHierarchy.vue';
import { object, string } from "yup";
import { useForm } from 'vee-validate';

interface Props {
  modelValue: Role | NewRole;
  submitHandler(): void
  updating?: boolean
}

const props = defineProps<Props>();
const role = ref<Role | NewRole>(props.modelValue);

const validate = object({
  name: string().required().min(3),
  description: string()
});

const { isSubmitting, handleSubmit } = useForm({
  validationSchema: validate
});

const submit = handleSubmit(props.submitHandler);

</script>