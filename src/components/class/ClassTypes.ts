// Tipos relacionados a turmas

export interface Teacher {
  id: string;
  name: string;
  email?: string;
}

export interface Class {
  id: string;
  name: string;
  days: number[]; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  startTime: string; // Formato "HH:mm" ex: "18:00"
  durationMinutes: number;
  isActive: boolean;
  teacher: Teacher;
  createdAt?: string;
  updatedAt?: string;
}

// Input type used by forms when creating a new class
export type NewClass = Omit<
  Class,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;
