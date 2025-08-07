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

// Demo users for the system
export const users: User[] = [
  {
    id: "1",
    email: "admin@gmail.com",
    password: "admin123", // In production, use proper hashing
    role: "admin",
    name: "Admin User",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    email: "haricharan@gmail.com",
    password: "hari123",
    role: "admin",
    name: "Haricharan",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    email: "user@gmail.com", 
    password: "user123",
    role: "user",
    name: "Regular User",
    createdAt: "2024-01-01T00:00:00Z"
  }
];

// Authentication functions
export const authenticateUser = (email: string, password: string): AuthUser | null => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
  }
  return null;
};

export const isValidEmail = (email: string): boolean => {
  return email.endsWith('@gmail.com') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const hasAdminPermissions = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};

export const hasEditPermissions = (user: AuthUser | null): boolean => {
  return user?.role === 'admin';
};
