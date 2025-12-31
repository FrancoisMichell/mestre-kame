import { createContext, useContext, useState } from "react";
import type { Student } from "./StudentTypes";
import type { PaginationMeta } from "../../types/api";
import { useFetchStudents, useAddStudent } from "../../api/hooks";

interface StudentContextType {
  students: Student[];
  meta?: PaginationMeta;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
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

  const {
    students: apiStudents,
    meta,
    isLoading,
    error,
    mutate,
  } = useFetchStudents({ page, limit });
  // Removido localStudents, usa diretamente apiStudents
  const addStudentAPI = useAddStudent();

  // Não é mais necessário sincronizar localStudents

  const addStudent = async (newStudent: Student) => {
    try {
      await addStudentAPI(newStudent);
      await mutate();
    } catch (err) {
      console.error("Failed to add student:", err);
      throw err;
    }
  };

  const refreshStudents = async () => {
    await mutate();
  };

  return (
    <StudentContext.Provider
      value={{
        students: apiStudents ?? [],
        meta,
        page,
        limit,
        setPage,
        setLimit: (newLimit: number) => {
          setLimit(newLimit);
          setPage(1); // Reset para primeira página ao mudar o limite
        },
        addStudent,
        refreshStudents,
        isLoading,
        error,
      }}
    >
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
