import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { computed, type ComputedRef } from 'vue';
import useUserSchemas from './useUserSchemas';
import { UserService } from '~/services/user-service';
import type {
  NewUser,
  NewUserFromAdmin,
  UpdateUser,
  ChangeUserPassword,
  User
} from '~/types/user';

// Define form modes as a union type
export type FormMode =
  | 'change-password'
  | 'register'
  | 'admin-create'
  | 'admin-update'
  | 'self-update';

// Union type for all possible form values
type FormValues = NewUser | NewUserFromAdmin | UpdateUser | ChangeUserPassword;

// Type for field visibility configuration
type FieldConfig = {
  name: { visible: boolean };
  email: { visible: boolean };
  password: { visible: boolean };
  password_confirmation: { visible: boolean };
  current_password: { visible: boolean };
  role_id: { visible: boolean };
};

// Define the composable with explicit types
export function useUserForm(mode: FormMode, initialData: Partial<User> = {}) {
  const {
    newUserSchema,
    newUserFromAdminSchema,
    updateUserSchema,
    changePasswordSchema
  } = useUserSchemas();

  // Select schema based on mode
  const schema = computed(() => {
    switch (mode) {
      case 'change-password':
        return toTypedSchema(changePasswordSchema);
      case 'register':
        return toTypedSchema(newUserSchema);
      case 'admin-create':
        return toTypedSchema(newUserFromAdminSchema);
      case 'admin-update':
      case 'self-update':
        return toTypedSchema(updateUserSchema);
      default:
        throw new Error('Invalid form mode');
    }
  });

  // Initialize VeeValidate form with typed values
  const {
    handleSubmit,
    defineField,
    errors,
    setFieldError,
    isSubmitting,
    resetForm
  } = useForm<FormValues>({
    validationSchema: schema,
    initialValues: initialData as FormValues // Cast to satisfy VeeValidate
  });

  // Define fields with explicit typing
  const [name, nameAttrs] = defineField('name');
  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');
  const [password_confirmation, passwordConfirmationAttrs] = defineField(
    'password_confirmation'
  );
  const [current_password, currentPasswordAttrs] =
    defineField('current_password');
  const [role_id, roleIdAttrs] = defineField('role_id');

  // Field visibility based on mode
  const fields: ComputedRef<FieldConfig> = computed(() => ({
    name: {
      visible: [
        'register',
        'admin-create',
        'admin-update',
        'self-update'
      ].includes(mode)
    },
    email: {
      visible: [
        'register',
        'admin-create',
        'admin-update',
        'self-update'
      ].includes(mode)
    },
    password: {
      visible: ['register', 'admin-create', 'change-password'].includes(mode)
    },
    password_confirmation: {
      visible: ['register', 'admin-create', 'change-password'].includes(mode)
    },
    current_password: {
      visible: ['change-password'].includes(mode)
    },
    role_id: { visible: mode === 'admin-create' || mode === 'admin-update' }
  }));

  // Submission logic
  const userService = new UserService();
  const onSubmit = handleSubmit(
    async (
      values: FormValues
    ): Promise<{ payload: User | null; error: unknown | null }> => {
      try {
        let data: User | null = null;

        switch (mode) {
          case 'change-password':
            if (!initialData.id)
              throw new Error('User ID is required for update');
            await userService.changePasswordById(
              initialData.id,
              values as ChangeUserPassword
            );
            break;
          case 'register':
            data = await userService.store({
              role_id: 1,
              ...(values as NewUser)
            } as NewUserFromAdmin);
            break;

          case 'admin-create':
            data = await userService.store(values as NewUserFromAdmin);
            break;

          case 'admin-update':
          case 'self-update':
            if (!initialData.id)
              throw new Error('User ID is required for update');
            data = await userService.updateById(
              initialData.id,
              values as UpdateUser
            );
            break;

          default:
            throw new Error(`Unsupported mode: ${mode}`);
        }

        return { payload: data, error: null };
      } catch (error) {
        return { payload: null, error };
      }
    }
  );

  // Return typed object
  return {
    name,
    nameAttrs,
    email,
    emailAttrs,
    password,
    passwordAttrs,
    password_confirmation,
    passwordConfirmationAttrs,
    current_password,
    currentPasswordAttrs,
    role_id,
    roleIdAttrs,
    fields,

    errors,
    setFieldError,
    resetForm,
    isSubmitting,
    onSubmit
  };
}
