import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import type React from "react";
import Header from "./components/common/Header";
import RegisterForm from "./components/student/StudentRegisterForm";
import { StudentProvider } from "./components/student/StudentContext";

const Router: React.FC = () => {
  return (
    <StudentProvider>
      <BrowserRouter>
        <Header />
        <main className="pt-24">
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<RegisterForm />} path="/cadastro" />
            <Route element={<h1>404 | Página não encontrada</h1>} path="*" />
          </Routes>
        </main>
      </BrowserRouter>
    </StudentProvider>
  );
};

export default Router;
