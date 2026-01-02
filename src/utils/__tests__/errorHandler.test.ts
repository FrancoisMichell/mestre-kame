import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AxiosError } from "axios";
import {
  getErrorMessage,
  parseAxiosError,
  parseNetworkError,
  parseAuthError,
  handleError,
  formatErrorForUser,
  withErrorHandling,
} from "../errorHandler";
import { ERROR_MESSAGES } from "../../constants/messages";

describe("Error Handler Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getErrorMessage", () => {
    it("should extract message from string", () => {
      const result = getErrorMessage("Error message");
      expect(result).toBe("Error message");
    });

    it("should extract message from Error object", () => {
      const error = new Error("Error object message");
      const result = getErrorMessage(error);
      expect(result).toBe("Error object message");
    });

    it("should extract message from object with message property", () => {
      const error = { message: "Object with message" };
      const result = getErrorMessage(error);
      expect(result).toBe("Object with message");
    });

    it("should return generic message for unknown error", () => {
      const result = getErrorMessage({ foo: "bar" });
      expect(result).toBe(ERROR_MESSAGES.GENERIC);
    });

    it("should return generic message for null", () => {
      const result = getErrorMessage(null);
      expect(result).toBe(ERROR_MESSAGES.GENERIC);
    });
  });

  describe("parseAxiosError", () => {
    it("should parse 400 error", () => {
      const axiosError = {
        response: {
          status: 400,
          statusText: "Bad Request",
          data: { message: "Invalid data" },
        },
        config: { url: "/api/test" },
      } as AxiosError;

      const result = parseAxiosError(axiosError);

      expect(result.status).toBe(400);
      expect(result.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
      expect(result.code).toBe("HTTP_400");
    });

    it("should parse 401 error", () => {
      const axiosError = {
        response: {
          status: 401,
          statusText: "Unauthorized",
          data: {},
        },
        config: { url: "/api/protected" },
      } as AxiosError;

      const result = parseAxiosError(axiosError);

      expect(result.status).toBe(401);
      expect(result.message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it("should parse 404 error", () => {
      const axiosError = {
        response: {
          status: 404,
          statusText: "Not Found",
          data: {},
        },
        config: { url: "/api/student/123" },
      } as AxiosError;

      const result = parseAxiosError(axiosError);

      expect(result.status).toBe(404);
      expect(result.message).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it("should parse 500 error", () => {
      const axiosError = {
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: {},
        },
        config: { url: "/api/test" },
      } as AxiosError;

      const result = parseAxiosError(axiosError);

      expect(result.status).toBe(500);
      expect(result.message).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it("should extract custom message from response", () => {
      const axiosError = {
        response: {
          status: 422,
          statusText: "Unprocessable Entity",
          data: { message: "Custom error message" },
        },
        config: { url: "/api/test" },
      } as AxiosError;

      const result = parseAxiosError(axiosError);

      expect(result.message).toBe("Custom error message");
    });
  });

  describe("parseNetworkError", () => {
    it("should detect timeout error", () => {
      const axiosError = {
        code: "ECONNABORTED",
        response: undefined,
      } as AxiosError;

      const result = parseNetworkError(axiosError);

      expect(result.timeout).toBe(true);
      expect(result.message).toBe(ERROR_MESSAGES.TIMEOUT);
    });

    it("should detect offline error", () => {
      const axiosError = {
        code: "ERR_NETWORK",
        response: undefined,
      } as AxiosError;

      const result = parseNetworkError(axiosError);

      expect(result.message).toBe(ERROR_MESSAGES.OFFLINE);
    });

    it("should detect generic network error", () => {
      const axiosError = {
        code: "UNKNOWN",
        response: undefined,
      } as AxiosError;

      const result = parseNetworkError(axiosError);

      expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
    });
  });

  describe("parseAuthError", () => {
    it("should parse session expired error", () => {
      const axiosError = {
        response: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      } as AxiosError;

      const result = parseAuthError(axiosError);

      expect(result.sessionExpired).toBe(true);
      expect(result.requiresLogin).toBe(true);
      expect(result.message).toBe(ERROR_MESSAGES.SESSION_EXPIRED);
    });
  });

  describe("handleError", () => {
    it("should handle axios network error", () => {
      const axiosError = {
        isAxiosError: true,
        code: "ERR_NETWORK",
        response: undefined,
      } as AxiosError;

      const result = handleError(axiosError);

      expect(result.message).toBe(ERROR_MESSAGES.OFFLINE);
    });

    it("should handle axios 401 error", () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
        },
      } as AxiosError;

      const result = handleError(axiosError);

      expect(result.message).toBe(ERROR_MESSAGES.SESSION_EXPIRED);
    });

    it("should handle axios HTTP error", () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: {},
        },
        config: { url: "/api/test" },
      } as AxiosError;

      const result = handleError(axiosError);

      expect(result.message).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it("should handle generic Error", () => {
      const error = new Error("Something went wrong");
      const result = handleError(error);

      expect(result.message).toBe("Something went wrong");
    });

    it("should handle string error", () => {
      const result = handleError("String error message");

      expect(result.message).toBe("String error message");
    });

    it("should handle unknown error", () => {
      const result = handleError({ unknown: "error" });

      expect(result.message).toBe(ERROR_MESSAGES.GENERIC);
    });
  });

  describe("formatErrorForUser", () => {
    it("should format error with code", () => {
      const error = {
        message: "Error message",
        code: "ERROR_CODE",
      };

      const result = formatErrorForUser(error);

      // Em dev mostra o código
      expect(result).toContain("Error message");
    });

    it("should format error without code", () => {
      const error = {
        message: "Error message",
      };

      const result = formatErrorForUser(error);

      expect(result).toBe("Error message");
    });
  });

  describe("withErrorHandling", () => {
    it("should return data on success", async () => {
      const fn = async () => "success data";

      const result = await withErrorHandling(fn);

      expect(result.data).toBe("success data");
      expect(result.error).toBeUndefined();
    });

    it("should return error on failure", async () => {
      const fn = async () => {
        throw new Error("Function error");
      };

      const result = await withErrorHandling(fn);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Function error");
    });

    it("should handle axios error", async () => {
      const fn = async () => {
        const error = {
          isAxiosError: true,
          response: {
            status: 404,
            statusText: "Not Found",
            data: {},
          },
          config: { url: "/api/test" },
        } as AxiosError;
        throw error;
      };

      const result = await withErrorHandling(fn, "TestContext");

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe(ERROR_MESSAGES.NOT_FOUND);
    });
  });
});
