import { describe, it, expect, beforeEach } from "vitest";
import { apiClient } from "../client";
import type { InternalAxiosRequestConfig } from "axios";

describe("API Client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should create axios instance with correct baseURL", () => {
    expect(apiClient.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
  });

  it("should have request interceptor configured", () => {
    // Verify that request interceptor is registered
    expect(apiClient.interceptors.request["handlers"]).toBeDefined();
    expect(apiClient.interceptors.request["handlers"].length).toBeGreaterThan(
      0,
    );
  });

  it("should have response interceptor configured", () => {
    // Verify that response interceptor is registered
    expect(apiClient.interceptors.response["handlers"]).toBeDefined();
    expect(apiClient.interceptors.response["handlers"].length).toBeGreaterThan(
      0,
    );
  });

  it("should add Authorization header when token exists in localStorage", async () => {
    const testToken = "test-auth-token-123";
    localStorage.setItem("authToken", testToken);

    // Access the request interceptor
    const interceptor = apiClient.interceptors.request["handlers"][0];
    if (interceptor && typeof interceptor.fulfilled === "function") {
      const config: Partial<InternalAxiosRequestConfig> = {
        headers: {} as InternalAxiosRequestConfig["headers"],
      };
      const modifiedConfig = await interceptor.fulfilled(
        config as InternalAxiosRequestConfig,
      );

      expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${testToken}`);
    }
  });

  it("should not add Authorization header when token does not exist", async () => {
    localStorage.removeItem("authToken");

    // Access the request interceptor
    const interceptor = apiClient.interceptors.request["handlers"][0];
    if (interceptor && typeof interceptor.fulfilled === "function") {
      const config: Partial<InternalAxiosRequestConfig> = {
        headers: {} as InternalAxiosRequestConfig["headers"],
      };
      const modifiedConfig = await interceptor.fulfilled(
        config as InternalAxiosRequestConfig,
      );

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    }
  });

  it("should preserve existing headers when adding Authorization", async () => {
    const testToken = "test-token";
    localStorage.setItem("authToken", testToken);

    // Access the request interceptor
    const interceptor = apiClient.interceptors.request["handlers"][0];
    if (interceptor && typeof interceptor.fulfilled === "function") {
      const config: Partial<InternalAxiosRequestConfig> = {
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
        } as InternalAxiosRequestConfig["headers"],
      };
      const modifiedConfig = await interceptor.fulfilled(
        config as InternalAxiosRequestConfig,
      );

      expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${testToken}`);
      expect(modifiedConfig.headers["Content-Type"]).toBe("application/json");
      expect(modifiedConfig.headers["X-Custom-Header"]).toBe("custom-value");
    }
  });
});
