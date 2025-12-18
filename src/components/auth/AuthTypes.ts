export interface User {
  id: string;
  name: string;
  registry: string;
  role: "teacher" | "student";
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
}
