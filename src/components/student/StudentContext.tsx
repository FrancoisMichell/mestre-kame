import { createContext, useContext, useState } from "react";
import type { Student } from "./StudentTypes";
import { getBeltColor } from "./StudentUtils";

interface StudentContextType {
  students: Student[];
  addStudent: (student: Student) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const studentsData: Student[] = [
  {
    id: "2023001",
    name: "Ana Silva",
    birthday: "2000-05-20",
    email: "ana.silva@exemplo.com",
    isActive: true,
    belt: "branca", // Rosa para Design
    trainingSince: "",
    color: getBeltColor("branca"),
  },
  {
    id: "2023045",
    name: "Bruno Costa",
    birthday: "2001-05-20",
    email: "bruno.c@exemplo.com",
    isActive: false, // Aluno inativo
    belt: "amarela", // Verde para Sistemas
    trainingSince: "2022-01-15",
    color: getBeltColor("amarela"),
  },
  {
    id: "2023089",
    name: "Carla Dias",
    birthday: "2003-05-20",
    email: "carla.dias@exemplo.com",
    isActive: true,
    belt: "laranja", // Azul para Computação
    trainingSince: "2022-01-15",
    color: getBeltColor("laranja"),
  },
];

interface StudentProviderProps {
  children: React.ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({
  children,
}) => {
  const [students, setStudents] = useState<Student[]>(studentsData);

  const addStudent = (newStudent: Student) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  return (
    <StudentContext.Provider value={{ students, addStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
