import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
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
});
