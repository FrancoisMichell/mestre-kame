import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { AuthProvider } from "../../components/auth/AuthContext";
import apiClient from "../../api/client";

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

// Mock do apiClient
vi.mock("../../api/client");

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Resetar os mocks para evitar que sessionExpiredMessage persista
    vi.resetModules();
  });

  it("should render login form", () => {
    renderLogin();

    expect(screen.getByText("Mestre Kame")).toBeInTheDocument();
    expect(screen.getByText("Faça login para continuar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ex: 01AA123123")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("should have correct input placeholders and types", () => {
    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");

    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toHaveAttribute("placeholder", "Ex: 01AA123123");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("placeholder", "********");
  });

  it("should update input values when typing", async () => {
    const user = userEvent.setup();
    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");

    await user.type(usernameInput, "joao123");
    await user.type(passwordInput, "senha123");

    expect(usernameInput).toHaveValue("joao123");
    expect(passwordInput).toHaveValue("senha123");
  });

  it("should submit form with correct credentials", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        token: "mock-jwt-token",
        user: {
          id: "1",
          name: "João Silva",
          username: "joao123",
          role: "student",
        },
      },
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(usernameInput, "joao123");
    await user.type(passwordInput, "senha123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/teacher/login", {
        username: "joao123",
        password: "senha123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display error message on login failure", async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: "Credenciais inválidas",
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(usernameInput, "invalid");
    await user.type(passwordInput, "wrong");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    });
  });

  it("should display generic error message when no specific message is provided", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Network error");

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(usernameInput, "joao123");
    await user.type(passwordInput, "senha123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao fazer login. Tente novamente."),
      ).toBeInTheDocument();
    });
  });

  it("should clear error message when user starts typing", async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: "Credenciais inválidas",
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    // First login attempt with error
    await user.type(usernameInput, "invalid");
    await user.type(passwordInput, "wrong");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    });

    // Start typing again
    await user.clear(usernameInput);
    await user.type(usernameInput, "j");

    expect(screen.queryByText("Credenciais inválidas")).not.toBeInTheDocument();
  });

  it("should disable submit button and show loading state during login", async () => {
    const user = userEvent.setup();
    let resolveLogin: (value: {
      data: { token: string; user: object };
    }) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    vi.mocked(apiClient.post).mockReturnValueOnce(
      loginPromise as Promise<{ data: { token: string; user: object } }>,
    );

    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Ex: 01AA123123");
    const passwordInput = screen.getByPlaceholderText("********");
    const submitButton = screen.getByRole("button", { name: "Entrar" });

    await user.type(usernameInput, "joao123");
    await user.type(passwordInput, "senha123");
    await user.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise
    resolveLogin!({
      data: {
        token: "mock-token",
        user: { id: "1", name: "João", username: "joao123", role: "student" },
      },
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("should render forgot password link", () => {
    renderLogin();
    expect(screen.getByText("Esqueceu a senha?")).toBeInTheDocument();
  });
});
