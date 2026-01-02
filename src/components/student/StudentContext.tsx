import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Student } from "./StudentTypes";
import type { PaginationMeta } from "../../types/api";
import { useFetchStudents, useAddStudent } from "../../api/hooks";

interface StudentContextType {
  students: Student[];
  meta?: PaginationMeta;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  addStudent: (student: Student) => Promise<void>;
  refreshStudents: () => Promise<void>;
  isLoading: boolean;
  error?: Error;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const {
    students: apiStudents,
    meta,
    isLoading,
    error,
    mutate,
  } = useFetchStudents({
    page,
    limit,
    sortBy: sortBy as "name" | "registry" | "belt" | "createdAt",
    sortOrder: sortOrder as "ASC" | "DESC",
  });
  // Removido localStudents, usa diretamente apiStudents
  const addStudentAPI = useAddStudent();

  const addStudent = useCallback(
    async (newStudent: Student) => {
      try {
        await addStudentAPI(newStudent);
        await mutate();
      } catch (err) {
        console.error("Failed to add student:", err);
        throw err;
      }
    },
    [addStudentAPI, mutate],
  );

  const refreshStudents = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset para primeira página ao mudar o limite
  }, []);

  // Memoizar o valor do contexto para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      students: apiStudents ?? [],
      meta,
      page,
      limit,
      sortBy,
      sortOrder,
      setPage,
      setLimit: handleSetLimit,
      setSortBy,
      setSortOrder,
      addStudent,
      refreshStudents,
      isLoading,
      error,
    }),
    [
      apiStudents,
      meta,
      page,
      limit,
      sortBy,
      sortOrder,
      handleSetLimit,
      addStudent,
      refreshStudents,
      isLoading,
      error,
    ],
  );

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
