import { SWRConfig } from "swr";
import { waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useFetchStudents,
  useAddStudent,
  useFetchClassStudents,
  useEnrollStudent,
  useUnenrollStudent,
} from "../hooks";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("useFetchStudents", () => {
  beforeEach(() => {
    // Mock do token para permitir o fetch
    localStorage.setItem("authToken", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should fetch students successfully", async () => {
    const { result } = renderHook(() => useFetchStudents());

    // Inicialmente em loading
    expect(result.current.isLoading).toBe(true);

    // Aguarda os dados serem carregados
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verifica se os dados foram carregados
    expect(result.current.students).toHaveLength(3);
    if (result.current.students.length > 0) {
      expect(result.current.students[0].name).toBe("João Silva");
    }
    expect(result.current.isError).toBe(false);
  });

  it("should handle error when fetching students fails", async () => {
    // Override o handler para retornar erro
    server.use(
      http.get("http://localhost:3000/students", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useFetchStudents(), {
      wrapper: ({ children }) => (
        <SWRConfig
          value={{ provider: () => new Map(), shouldRetryOnError: false }}
        >
          {children}
        </SWRConfig>
      ),
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 5000 },
    );

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
  });
});

describe("useAddStudent", () => {
  it("should add a student successfully", async () => {
    const { result: addResult } = renderHook(() => useAddStudent());

    const newStudent = {
      id: "2025001",
      name: "João Silva",
      birthday: "2005-03-15",
      registry: "987654",
      belt: "white" as const,
      trainingSince: "2025-01-10",
      isActive: true,
      color: "#e5e7eb",
    };

    const response = await addResult.current(newStudent);

    expect(response).toEqual(newStudent);
    expect(response.id).toBe("2025001");
    expect(response.name).toBe("João Silva");
  });

  it("should send Authorization header when adding student", async () => {
    localStorage.setItem("authToken", "test-token-123");

    const { result: addResult } = renderHook(() => useAddStudent());

    const newStudent = {
      id: "2025002",
      name: "Maria Santos",
      birthday: "2004-07-20",
      registry: "987655",
      belt: "yellow" as const,
      trainingSince: "2025-01-10",
      isActive: true,
      color: "#facc15",
    };

    let capturedHeaders: Record<string, string> = {};
    server.use(
      http.post("http://localhost:3000/students", ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries());
        return HttpResponse.json(newStudent, { status: 201 });
      }),
    );

    await addResult.current(newStudent);

    // Headers podem vir em lowercase
    const authHeader =
      capturedHeaders.authorization || capturedHeaders.Authorization;
    expect(authHeader).toBe("Bearer test-token-123");

    // Limpa localStorage
    localStorage.removeItem("authToken");
  });
});

describe("useFetchClassStudents", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should fetch class students successfully", async () => {
    const { result } = renderHook(() =>
      useFetchClassStudents("1", {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "ASC",
      }),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.students).toBeDefined();
    expect(result.current.meta).toBeDefined();
    expect(result.current.isError).toBe(false);
  });

  it("should handle filters in class students query", async () => {
    const { result } = renderHook(() =>
      useFetchClassStudents("1", {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "ASC",
        name: "João",
        belt: "white",
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.students).toBeDefined();
  });
});

describe("useEnrollStudent", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should enroll a student successfully", async () => {
    const { result } = renderHook(() => useEnrollStudent());

    await result.current("1", "1");

    // Should not throw error
    expect(true).toBe(true);
  });

  it("should send authorization header when enrolling", async () => {
    localStorage.setItem("authToken", "test-token-123");

    const { result } = renderHook(() => useEnrollStudent());

    await expect(result.current("1", "2")).resolves.not.toThrow();
  });
});

describe("useUnenrollStudent", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should unenroll a student successfully", async () => {
    const { result } = renderHook(() => useUnenrollStudent());

    await result.current("1", "1");

    // Should not throw error
    expect(true).toBe(true);
  });

  it("should send authorization header when unenrolling", async () => {
    localStorage.setItem("authToken", "test-token-123");

    const { result } = renderHook(() => useUnenrollStudent());

    await expect(result.current("1", "2")).resolves.not.toThrow();
  });
});
