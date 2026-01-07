export interface UserRole {
  id: string;
  role: string;
}

export interface User {
  id: string;
  name: string;
  registry: string;
  belt?: string;
  birthday?: string;
  trainingSince?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  roles: UserRole[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  handleSessionExpired: () => void;
  sessionExpiredMessage: string | null;
}
