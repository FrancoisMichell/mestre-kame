import { createContext, useContext, useEffect, useState } from "react";
import type { Student } from "./StudentTypes";
import { useFetchStudents, useAddStudent } from "../../api/hooks";

interface StudentContextType {
  students: Student[];
  addStudent: (student: Student) => Promise<void>;
  isLoading: boolean;
  error?: Error;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    students: apiStudents,
    isLoading,
    error,
    mutate,
  } = useFetchStudents();
  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const addStudentAPI = useAddStudent();

  useEffect(() => {
    setLocalStudents(apiStudents);
  }, [apiStudents]);

  const addStudent = async (newStudent: Student) => {
    try {
      await addStudentAPI(newStudent);
      await mutate();
    } catch (err) {
      console.error("Failed to add student:", err);
      throw err;
    }
  };

  return (
    <StudentContext.Provider
      value={{ students: localStudents, addStudent, isLoading, error }}
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
