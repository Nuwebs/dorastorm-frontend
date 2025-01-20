import type { Role } from './role';

export interface NewUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface NewUserFromAdmin extends NewUser {
  role_id: number;
}

export type UpdateUser = Omit<
  NewUserFromAdmin,
  'password' | 'password_confirmation'
>;

export interface BaseUser
  extends Omit<NewUser, 'password' | 'password_confirmation'> {
  id: number;
  created_at: string;
}

export interface User extends BaseUser {
  role: Role;
}

export interface ChangeUserPassword {
  password: string;
  password_confirmation: string;
  current_password: string;
}
