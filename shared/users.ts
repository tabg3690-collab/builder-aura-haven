export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  role: 'admin' | 'user';
  name: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

// Validation functions
export const isValidEmail = (email: string): boolean => {
  return email.endsWith('@gmail.com') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const hasAdminPermissions = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};

export const hasEditPermissions = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};
