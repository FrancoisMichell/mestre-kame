import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import type React from "react";
import Header from "./components/common/Header";
import RegisterForm from "./components/student/StudentRegisterForm";
import { StudentProvider } from "./components/student/StudentContext";
import { useEffect, type ReactNode } from "react";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import Login from "./pages/Login";
import { setSessionExpiredCallback } from "./api/client";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { handleSessionExpired } = useAuth();

  useEffect(() => {
    setSessionExpiredCallback(handleSessionExpired);
  }, [handleSessionExpired]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Header />
            <main className="pt-24">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<RegisterForm />} path="/cadastro" />
                <Route
                  element={<h1>404 | Página não encontrada</h1>}
                  path="*"
                />
              </Routes>
            </main>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const Router: React.FC = () => {
  return (
    <AuthProvider>
      <StudentProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StudentProvider>
    </AuthProvider>
  );
};

export default Router;
