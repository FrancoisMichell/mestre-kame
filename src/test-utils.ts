import { vi } from "vitest";
import type { StudentContextType } from "./components/student/StudentContext";

/**
 * Helper para criar mock do StudentContext com valores padrão
 */
export const createMockStudentContext = (
  overrides: Partial<StudentContextType> = {},
): StudentContextType => ({
  students: [],
  meta: undefined,
  page: 1,
  limit: 12,
  searchName: "",
  searchRegistry: "",
  filterBelt: "",
  filterIsActive: "",
  setPage: vi.fn(),
  setLimit: vi.fn(),
  setSearchName: vi.fn(),
  setSearchRegistry: vi.fn(),
  setFilterBelt: vi.fn(),
  setFilterIsActive: vi.fn(),
  isLoading: false,
  error: undefined,
  addStudent: vi.fn(),
  refreshStudents: vi.fn(),
  ...overrides,
});
