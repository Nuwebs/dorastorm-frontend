import type { Role } from "./role";

export interface NewUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface BaseUser
  extends Omit<NewUser, "password" | "password_confirmation"> {
  id: number;
  created_at: string;
}

export interface User extends BaseUser {
  role: Role;
}
