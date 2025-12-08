import { describe, it, expect, beforeEach } from "vitest";
import { apiClient } from "../client";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("API Client", () => {
  beforeEach(() => {
    localStorage.clear();
    // Adiciona handler padrão para GET / nos testes
    server.use(
      http.get("http://localhost:3000/", () => {
        return HttpResponse.json({ success: true });
      }),
    );
  });

  it("should create axios instance with correct baseURL", () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
  });

  it("should have request interceptor configured", () => {
    expect(typeof apiClient.interceptors.request.use).toBe("function");
  });

  it("should have response interceptor configured", () => {
    expect(typeof apiClient.interceptors.response.use).toBe("function");
  });

  it("should add Authorization header when token exists in localStorage", async () => {
    const testToken = "test-auth-token-123";
    localStorage.setItem("authToken", testToken);
    let capturedHeaders: Record<string, string> = {};
    await apiClient.get("/", {
      transformRequest: [
        function (data, headers) {
          capturedHeaders = headers;
          return data;
        },
      ],
    });
    expect(capturedHeaders.Authorization).toBe(`Bearer ${testToken}`);
  });

  it("should not add Authorization header when token does not exist", async () => {
    localStorage.removeItem("authToken");
    let capturedHeaders: Record<string, string> = {};
    await apiClient.get("/", {
      transformRequest: [
        function (data, headers) {
          capturedHeaders = headers;
          return data;
        },
      ],
    });
    expect(capturedHeaders.Authorization).toBeUndefined();
  });

  it("should preserve existing headers when adding Authorization", async () => {
    let capturedHeaders: Record<string, string> = {};
    await apiClient.get("/", {
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "custom-value",
      },
      transformRequest: [
        function (data, headers) {
          capturedHeaders = headers;
          return data;
        },
      ],
    });
    expect(capturedHeaders["X-Custom-Header"]).toBe("custom-value");
    expect(capturedHeaders["Content-Type"]).toBe("application/json");
  });
});
