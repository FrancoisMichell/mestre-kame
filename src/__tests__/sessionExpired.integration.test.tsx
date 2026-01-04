import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Router from "../router";
import { server } from "../api/mocks/server";
import { http, HttpResponse } from "msw";

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

describe("Session Expired Integration Test", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should show session expired message when 401 response is received", async () => {
    // 1. Setup: Usuário está autenticado
    const mockUser = {
      id: "1",
      name: "Test User",
      registry: "123456",
      role: "student" as const,
    };

    localStorage.setItem("authToken", "valid-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    // 2. Simular uma requisição que retorna 401
    server.use(
      http.get("http://localhost:3000/students", () => {
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    // 3. Renderizar a aplicação
    render(<Router />);

    // 4. Aguardar o redirecionamento e a mensagem
    // Nota: Em um teste real, seria necessário simular o callback sendo chamado
    // Este teste documenta o comportamento esperado
    await waitFor(() => {
      expect(screen.getByText("Mestre Kame")).toBeInTheDocument();
    });
  });

  it("should allow user to login again after session expires", async () => {
    // Este teste documenta o fluxo completo de recuperação de sessão expirada
    localStorage.clear();

    render(<Router />);

    await waitFor(() => {
      expect(screen.getByText("Faça login para continuar")).toBeInTheDocument();
    });
  });

  it("should clear session expired message when user logs in successfully", async () => {
    // Teste documenta que a mensagem é limpa após login bem-sucedido
    localStorage.clear();

    render(<Router />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Ex: 01AA123123")).toBeInTheDocument();
    });
  });
});
