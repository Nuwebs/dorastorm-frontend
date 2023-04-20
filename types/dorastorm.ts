export interface Role {
  id: number;
  hierarchy: number;
  name: string;
  description: string;
  permissions: string[];
  created: string;
  modified: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: Role;
}

export interface DsLoginCredentials {
  email: string,
  password: string
}

// Error related
export interface DsErrorBag {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}
