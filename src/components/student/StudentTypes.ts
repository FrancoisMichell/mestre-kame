export type Belt =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black";

export interface Student {
  id: string;
  name: string;
  birthday: string | null;
  registry: string;
  isActive: boolean;
  belt: Belt;
  trainingSince: string | null;
  color: string;
}

export interface StudentCardProps {
  student: Student;
}

// Input type used by forms when creating a new student.
// Forms typically don't provide `color` (derived from `belt`) nor `isActive`.
// NewStudentInput: used by forms. Dates are represented as strings in inputs,
// so we override `birthday` and `trainingSince` to be `string` instead of `string | null`.
export type NewStudent = {
  name: string;
  registry?: string;
  belt: Belt;
  birthday?: string;
  trainingSince?: string;
};
