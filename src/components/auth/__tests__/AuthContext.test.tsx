import "@testing-library/jest-dom";
import { renderHook, waitFor, render } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import apiClient from "../../../api/client";
import type { ReactNode } from "react";

// Mock do apiClient
vi.mock("../../../api/client");

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should start with no authenticated user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should restore user from localStorage on mount", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };

    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should login successfully and store user data", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };

    const mockResponse = {
      data: {
        token: "mock-jwt-token",
        user: mockUser,
      },
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login({ username: "joao123", password: "senha123" });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(localStorage.getItem("authToken")).toBe("mock-jwt-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
  });

  it("should throw error on failed login", async () => {
    const mockError = new Error("Invalid credentials");
    vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.login({ username: "invalid", password: "wrong" }),
    ).rejects.toThrow("Invalid credentials");

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should logout and clear user data", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };

    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });

    result.current.logout();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should handle corrupted localStorage data", async () => {
    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", "invalid-json{");

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should throw error when useAuth is used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });

  it("should handle session expiration and set message", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };

    localStorage.setItem("authToken", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });

    result.current.handleSessionExpired();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.sessionExpiredMessage).toBe(
        "Sua sessão expirou. Por favor, faça login novamente.",
      );
    });

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should clear session expired message on successful login", async () => {
    const mockUser = {
      id: "1",
      name: "João Silva",
      username: "joao123",
      role: "student" as const,
    };

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simular sessão expirada
    result.current.handleSessionExpired();

    await waitFor(() => {
      expect(result.current.sessionExpiredMessage).not.toBeNull();
    });

    // Fazer login com sucesso
    const mockResponse = {
      data: {
        token: "new-token",
        user: mockUser,
      },
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

    await result.current.login({ username: "joao123", password: "senha123" });

    await waitFor(() => {
      expect(result.current.sessionExpiredMessage).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it("should clear session expired message on logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simular sessão expirada
    result.current.handleSessionExpired();

    await waitFor(() => {
      expect(result.current.sessionExpiredMessage).not.toBeNull();
    });

    // Fazer logout
    result.current.logout();

    await waitFor(() => {
      expect(result.current.sessionExpiredMessage).toBeNull();
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should keep stable callback references", async () => {
      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstLogin = result.current.login;
      const firstLogout = result.current.logout;
      const firstHandleSessionExpired = result.current.handleSessionExpired;

      // Force re-render
      rerender();

      const secondLogin = result.current.login;
      const secondLogout = result.current.logout;
      const secondHandleSessionExpired = result.current.handleSessionExpired;

      // All callbacks should maintain the same reference
      expect(firstLogin).toBe(secondLogin);
      expect(firstLogout).toBe(secondLogout);
      expect(firstHandleSessionExpired).toBe(secondHandleSessionExpired);
    });

    it("should memoize context value properly", async () => {
      let renderCount = 0;
      const TestComponent = () => {
        const auth = useAuth();
        renderCount++;
        return <div>{auth.isAuthenticated ? "yes" : "no"}</div>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(0);
      });

      // Context value is memoized, so renders should be minimal
      // Initial render + loading state change = 2 renders max
      expect(renderCount).toBeLessThanOrEqual(2);
    });

    it("should only update callbacks when dependencies change", async () => {
      const mockUser = {
        id: "1",
        name: "João Silva",
        username: "joao123",
        role: "student" as const,
      };

      const mockResponse = {
        data: {
          token: "mock-jwt-token",
          user: mockUser,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loginBeforeChange = result.current.login;

      // Login (changes user state)
      await result.current.login({ username: "joao123", password: "senha123" });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      rerender();

      // login callback should still be the same reference (no dependencies)
      expect(result.current.login).toBe(loginBeforeChange);
    });
  });
});
