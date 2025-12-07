import { vi } from "vitest";

export const useFetchStudents = vi.fn(() => ({
  students: [],
  isLoading: false,
  isError: false,
  error: undefined,
  mutate: vi.fn(),
}));

export const useAddStudent = vi.fn(() => vi.fn(async () => {}));
