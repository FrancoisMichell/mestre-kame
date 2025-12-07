import { http, HttpResponse } from "msw";
import type { Student } from "../../components/student/StudentTypes";

const API_BASE_URL = "http://localhost:3000";

const mockStudents: Student[] = [
  {
    id: "2023001",
    name: "Ana Silva",
    birthday: "2000-05-20",
    email: "ana.silva@exemplo.com",
    isActive: true,
    belt: "branca",
    trainingSince: "",
    color: "#e5e7eb",
  },
  {
    id: "2023045",
    name: "Bruno Costa",
    birthday: "2001-05-20",
    email: "bruno.c@exemplo.com",
    isActive: false,
    belt: "amarela",
    trainingSince: "2022-01-15",
    color: "#facc15",
  },
];

export const handlers = [
  http.get(`${API_BASE_URL}/students`, () => {
    return HttpResponse.json(mockStudents, { status: 200 });
  }),

  http.post(`${API_BASE_URL}/students`, async ({ request }) => {
    const newStudent = (await request.json()) as Student;
    return HttpResponse.json(newStudent, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/students/:id`, ({ params }) => {
    const student = mockStudents.find((s) => s.id === params.id);
    if (!student) {
      return HttpResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(student, { status: 200 });
  }),
];
