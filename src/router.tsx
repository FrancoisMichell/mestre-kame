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
import StudentEdit from "./components/student/StudentEdit";
import LoadingSpinner from "./components/common/LoadingSpinner";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { handleSessionExpired } = useAuth();

  useEffect(() => {
    setSessionExpiredCallback(handleSessionExpired);

    // Cleanup: remove callback quando componente desmontar
    return () => {
      setSessionExpiredCallback(() => {});
    };
  }, [handleSessionExpired]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <StudentProvider>
              <Header />
              <main className="pt-24">
                <Routes>
                  <Route element={<Home />} path="/" />
                  <Route element={<RegisterForm />} path="/cadastro" />
                  <Route element={<StudentEdit />} path="/aluno/:id" />
                  <Route
                    element={<h1>404 | Página não encontrada</h1>}
                    path="*"
                  />
                </Routes>
              </main>
            </StudentProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const Router: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default Router;
