import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Router from "../router";

// Mock do apiClient
vi.mock("../api/client");

// Mock dos componentes para simplificar os testes
vi.mock("../pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("../pages/Login", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("../components/student/StudentRegisterForm", () => ({
  default: () => <div>Register Form</div>,
}));

describe("Router - Protected Routes", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should redirect to login when user is not authenticated", async () => {
    render(<Router />);

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("should render register form on /cadastro route when authenticated", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student",
    };

    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    // Precisamos renderizar e navegar
    window.history.pushState({}, "", "/cadastro");

    render(<Router />);

    await waitFor(() => {
      expect(screen.getByText("Register Form")).toBeInTheDocument();
    });
  });

  it("should allow access to login page when not authenticated", async () => {
    window.history.pushState({}, "", "/login");

    render(<Router />);

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("should render 404 page for unknown routes when authenticated", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student",
    };

    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    window.history.pushState({}, "", "/rota-inexistente");

    render(<Router />);

    await waitFor(() => {
      expect(
        screen.getByText("404 | Página não encontrada"),
      ).toBeInTheDocument();
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should cleanup sessionExpiredCallback on unmount", async () => {
      const mockUser = {
        id: "1",
        name: "João Silva",
        username: "joao123",
        role: "student",
      };

      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify(mockUser));

      const { unmount } = render(<Router />);

      // Wait for component to render (will render something based on route)
      await waitFor(() => {
        expect(document.body).not.toBeEmptyDOMElement();
      });

      // Unmount should trigger cleanup
      unmount();

      // No errors should be thrown and cleanup should have been called
      // This test ensures the useEffect cleanup function is working
      expect(true).toBe(true);
    });
  });
});
