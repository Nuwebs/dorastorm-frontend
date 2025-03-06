import { object, string, number, type z } from 'zod';
import { useI18n } from '#imports';

export default function useUserSchemas() {
  const { t } = useI18n();

  // Base schema with translated messages
  const baseUserSchema = object({
    name: string().min(1),
    email: string().email(),
    password: string().min(8),
    password_confirmation: string().min(8)
  });

  // Reusable password confirmation refinement with translated message
  const passwordConfirmationRefinement = {
    refine: (data: z.infer<typeof baseUserSchema>) =>
      data.password === data.password_confirmation,
    params: {
      message: t('error.validation.confirm_password'),
      path: ['password_confirmation']
    }
  };

  // Public registration schema
  const newUserSchema = baseUserSchema.refine(
    passwordConfirmationRefinement.refine,
    passwordConfirmationRefinement.params
  );

  // Admin creating users schema
  const newUserFromAdminSchema = baseUserSchema
    .extend({
      role_id: number().int().positive()
    })
    .refine(
      passwordConfirmationRefinement.refine,
      passwordConfirmationRefinement.params
    );

  // Updating users schema (no password fields)
  const updateUserSchema = object({
    name: string().min(1),
    email: string().email(),
    role_id: number().int().positive().optional()
  });

  return { newUserSchema, newUserFromAdminSchema, updateUserSchema };
}
