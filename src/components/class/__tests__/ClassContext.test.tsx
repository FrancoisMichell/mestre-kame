import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ReactNode } from "react";
import type { Class } from "../ClassTypes";
import { ClassProvider, useClasses } from "../ClassContext";

// Mock do módulo de hooks
vi.mock("../../../api/hooks", () => ({
  useFetchClasses: vi.fn(),
}));

// Importar após mockar
import { useFetchClasses } from "../../../api/hooks";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ClassProvider>{children}</ClassProvider>
);

describe("ClassContext", () => {
  const mockClasses: Class[] = [
    {
      id: "1",
      name: "Turma Manhã",
      days: [1, 3, 5],
      startTime: "08:00",
      durationMinutes: 60,
      isActive: true,
      teacher: {
        id: "teacher-1",
        name: "Professor João",
      },
    },
    {
      id: "2",
      name: "Turma Noite",
      days: [2, 4],
      startTime: "19:00",
      durationMinutes: 90,
      isActive: true,
      teacher: {
        id: "teacher-1",
        name: "Professor João",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide classes from API", async () => {
    const mockMutate = vi.fn();

    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.classes).toEqual(mockClasses);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });
  });

  it("should handle loading state", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: [],
      meta: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
      expect(result.current.classes).toEqual([]);
    });
  });

  it("should handle error state", async () => {
    const mockError = new Error("Failed to fetch classes");

    vi.mocked(useFetchClasses).mockReturnValue({
      classes: [],
      meta: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
      expect(result.current.classes).toEqual([]);
    });
  });

  it("should provide pagination meta", async () => {
    const mockMeta = {
      total: 20,
      page: 1,
      totalPages: 2,
    };

    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: mockMeta,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.meta).toEqual(mockMeta);
    });
  });

  it("should initialize with default pagination values", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: [],
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.limit).toBeGreaterThan(0);
      expect(result.current.includeInactive).toBe(false);
    });
  });

  it("should update page", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });

    result.current.setPage(2);

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });
  });

  it("should update limit and reset to page 1", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    // First set page to 2
    result.current.setPage(2);

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // Then change limit - should reset to page 1
    result.current.setLimit(20);

    await waitFor(() => {
      expect(result.current.limit).toBe(20);
      expect(result.current.page).toBe(1);
    });
  });

  it("should update includeInactive filter", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(result.current.includeInactive).toBe(false);
    });

    result.current.setIncludeInactive(true);

    await waitFor(() => {
      expect(result.current.includeInactive).toBe(true);
    });
  });

  it("should call mutate when refreshClasses is called", async () => {
    const mockMutate = vi.fn();

    vi.mocked(useFetchClasses).mockReturnValue({
      classes: mockClasses,
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await result.current.refreshClasses();

    expect(mockMutate).toHaveBeenCalled();
  });

  it("should provide all required context functions", async () => {
    vi.mocked(useFetchClasses).mockReturnValue({
      classes: [],
      meta: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => useClasses(), { wrapper });

    await waitFor(() => {
      expect(typeof result.current.setPage).toBe("function");
      expect(typeof result.current.setLimit).toBe("function");
      expect(typeof result.current.setIncludeInactive).toBe("function");
      expect(typeof result.current.refreshClasses).toBe("function");
    });
  });
});
