import { number, string } from 'zod';

export const BASIC_FIELDS = {
  email: string().email().min(1),
  name: string().min(1)
};

export const PASSWORDS_FIELDS = {
  password: string().min(8),
  password_confirmation: string()
};

export const ROLE_FIELD = {
  role_id: number().min(1)
};
