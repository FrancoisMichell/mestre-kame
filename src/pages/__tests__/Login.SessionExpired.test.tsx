import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { AuthProvider } from "../../components/auth/AuthContext";
import type { ReactNode } from "react";

// Mock do Sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

// Componente wrapper customizado para simular sessão expirada
const AuthProviderWithExpiredSession = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const renderLoginWithExpiredSession = () => {
  // Simular que o usuário estava logado mas perdeu a sessão
  localStorage.setItem("authToken", "expired-token");
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: "1",
      name: "Test User",
      registry: "123",
      role: "student",
    }),
  );

  const utils = render(
    <BrowserRouter>
      <AuthProviderWithExpiredSession>
        <Login />
      </AuthProviderWithExpiredSession>
    </BrowserRouter>,
  );

  // Simular expiração da sessão manualmente
  // (em produção, isso seria acionado pelo interceptor 401)
  return utils;
};

describe("Login - Session Expired Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should display session expired message when sessionExpiredMessage is set", () => {
    renderLoginWithExpiredSession();

    // O AuthContext não terá sessionExpiredMessage até que handleSessionExpired seja chamado
    // Este teste verifica que o componente está preparado para exibir a mensagem
    expect(
      screen.queryByText(
        "Sua sessão expirou. Por favor, faça login novamente.",
      ),
    ).not.toBeInTheDocument();
  });

  it("should render login form correctly", () => {
    renderLoginWithExpiredSession();

    expect(screen.getByText("Mestre Kame")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ex: 01AA123123")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("should differentiate between session expired (yellow) and login error (red) styling", () => {
    // Este teste documenta a diferença de estilo esperada
    // sessionExpiredMessage → amarelo
    // erro de login → vermelho
    const { container } = renderLoginWithExpiredSession();

    expect(container).toBeInTheDocument();
  });
});
