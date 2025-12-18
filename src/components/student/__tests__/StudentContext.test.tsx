import "@testing-library/jest-dom";
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ReactNode } from "react";
import type { Student } from "../StudentTypes";
import { StudentProvider, useStudents } from "../StudentContext";
import * as hooks from "../../../api/hooks";

// Mock dos hooks da API
vi.mock("../../../api/hooks");

const { useFetchStudents, useAddStudent } = hooks;

const wrapper = ({ children }: { children: ReactNode }) => (
  <StudentProvider>{children}</StudentProvider>
);

describe("StudentContext", () => {
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@exemplo.com",
      birthday: "2000-01-15",
      belt: "branca",
      trainingSince: "2024-01-10",
      isActive: true,
      color: "#E5E7EB",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@exemplo.com",
      birthday: "1998-05-20",
      belt: "azul",
      trainingSince: "2023-06-15",
      isActive: true,
      color: "#2563eb",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide students from API", async () => {
    const mockMutate = vi.fn();

    vi.mocked(useFetchStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: mockMutate,
    });

    vi.mocked(useAddStudent).mockReturnValue(vi.fn());

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual(mockStudents);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });
  });

  it("should handle loading state", async () => {
    vi.mocked(useFetchStudents).mockReturnValue({
      students: [],
      isLoading: true,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    vi.mocked(useAddStudent).mockReturnValue(vi.fn());

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
      expect(result.current.students).toEqual([]);
    });
  });

  it("should handle error state", async () => {
    const mockError = new Error("Failed to fetch students");

    vi.mocked(useFetchStudents).mockReturnValue({
      students: [],
      isLoading: false,
      isError: true,
      error: mockError,
      mutate: vi.fn(),
    });

    vi.mocked(useAddStudent).mockReturnValue(vi.fn());

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
      expect(result.current.students).toEqual([]);
    });
  });

  it("should add student successfully and refresh list", async () => {
    const mockMutate = vi.fn();
    const mockAddStudentAPI = vi.fn().mockResolvedValue(undefined);

    vi.mocked(useFetchStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: mockMutate,
    });

    vi.mocked(useAddStudent).mockReturnValue(mockAddStudentAPI);

    const { result } = renderHook(() => useStudents(), { wrapper });

    const newStudent: Student = {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@exemplo.com",
      birthday: "2001-03-10",
      belt: "amarela",
      trainingSince: "2024-02-01",
      isActive: true,
      color: "#EAB308",
    };

    await act(async () => {
      await result.current.addStudent(newStudent);
    });

    expect(mockAddStudentAPI).toHaveBeenCalledWith(newStudent);
    expect(mockMutate).toHaveBeenCalled();
  });

  it("should handle error when adding student fails", async () => {
    const mockMutate = vi.fn();
    const mockError = new Error("Failed to add student");
    const mockAddStudentAPI = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useFetchStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: mockMutate,
    });

    vi.mocked(useAddStudent).mockReturnValue(mockAddStudentAPI);

    const { result } = renderHook(() => useStudents(), { wrapper });

    const newStudent: Student = {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@exemplo.com",
      birthday: "2001-03-10",
      belt: "amarela",
      trainingSince: "2024-02-01",
      isActive: true,
      color: "#EAB308",
    };

    await expect(
      act(async () => {
        await result.current.addStudent(newStudent);
      }),
    ).rejects.toThrow("Failed to add student");

    expect(mockAddStudentAPI).toHaveBeenCalledWith(newStudent);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should return empty array when students is undefined", async () => {
    vi.mocked(useFetchStudents).mockReturnValue({
      students: undefined as unknown as Student[],
      isLoading: false,
      isError: false,
      error: undefined,
      mutate: vi.fn(),
    });

    vi.mocked(useAddStudent).mockReturnValue(vi.fn());

    const { result } = renderHook(() => useStudents(), { wrapper });

    await waitFor(() => {
      expect(result.current.students).toEqual([]);
    });
  });

  it("should throw error when useStudents is used outside StudentProvider", () => {
    expect(() => {
      renderHook(() => useStudents());
    }).toThrow("useStudents must be used within a StudentProvider");
  });
});
