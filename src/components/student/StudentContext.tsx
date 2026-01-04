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
import { useDebounce } from "../../hooks/useDebounce";
import { useResponsiveLimit } from "../../hooks/useResponsiveLimit";

export interface StudentContextType {
  students: Student[];
  meta?: PaginationMeta;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  searchName: string;
  searchRegistry: string;
  filterBelt: string;
  filterIsActive: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setSearchName: (name: string) => void;
  setSearchRegistry: (registry: string) => void;
  setFilterBelt: (belt: string) => void;
  setFilterIsActive: (isActive: string) => void;
  addStudent: (student: Student) => Promise<void>;
  refreshStudents: () => Promise<void>;
  isLoading: boolean;
  error?: Error;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const responsiveLimit = useResponsiveLimit();
  const [page, setPage] = useState(1);
  // Inicializa com o valor responsivo, mas permite mudança manual
  const [limit, setLimit] = useState(() => responsiveLimit);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  // Estados para os inputs (atualizados imediatamente)
  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchRegistryInput, setSearchRegistryInput] = useState("");

  const [filterBelt, setFilterBelt] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");

  // Debounce automático usando custom hook
  const searchName = useDebounce(searchNameInput, 500);
  const searchRegistry = useDebounce(searchRegistryInput, 500);

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
    name: searchName || undefined,
    registry: searchRegistry || undefined,
    belt: filterBelt || undefined,
    isActive: filterIsActive ? filterIsActive === "true" : undefined,
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

  const handleSetSearchName = useCallback((name: string) => {
    setSearchNameInput(name); // Atualiza o input imediatamente
  }, []);

  const handleSetSearchRegistry = useCallback((registry: string) => {
    setSearchRegistryInput(registry); // Atualiza o input imediatamente
  }, []);

  const handleSetFilterBelt = useCallback((belt: string) => {
    setFilterBelt(belt);
    setPage(1); // Reset para primeira página ao filtrar
  }, []);

  const handleSetFilterIsActive = useCallback((isActive: string) => {
    setFilterIsActive(isActive);
    setPage(1); // Reset para primeira página ao filtrar
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
      searchName: searchNameInput, // Retorna o valor do input para os componentes
      searchRegistry: searchRegistryInput, // Retorna o valor do input para os componentes
      filterBelt,
      filterIsActive,
      setPage,
      setLimit: handleSetLimit,
      setSortBy,
      setSortOrder,
      setSearchName: handleSetSearchName,
      setSearchRegistry: handleSetSearchRegistry,
      setFilterBelt: handleSetFilterBelt,
      setFilterIsActive: handleSetFilterIsActive,
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
      searchNameInput,
      searchRegistryInput,
      filterBelt,
      filterIsActive,
      handleSetLimit,
      handleSetSearchName,
      handleSetSearchRegistry,
      handleSetFilterBelt,
      handleSetFilterIsActive,
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
