import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { AuthContextType, LoginCredentials, User } from "./AuthTypes";
import apiClient from "../../api/client";
import { ENDPOINTS } from "../../api/endpoints";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Erro ao recuperar usuário", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setSessionExpiredMessage(null);
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setSessionExpiredMessage(null);
  }, []);

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setSessionExpiredMessage(
      "Sua sessão expirou. Por favor, faça login novamente.",
    );
  }, []);

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      handleSessionExpired,
      sessionExpiredMessage,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      handleSessionExpired,
      sessionExpiredMessage,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
