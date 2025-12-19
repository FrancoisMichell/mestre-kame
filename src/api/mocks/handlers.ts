import { http, HttpResponse } from "msw";
import type { Student } from "../../components/student/StudentTypes";

const API_BASE_URL = "http://localhost:3000";

const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    belt: "White",
    color: "#E5E7EB",
    birthday: "2000-05-15",
    registry: "987654",
    trainingSince: "2024-01-10",
    isActive: true,
  },
  {
    id: "2",
    name: "Maria Santos",
    belt: "Blue",
    color: "#2563eb",
    birthday: "1998-08-20",
    registry: "987655",
    trainingSince: "2023-06-15",
    isActive: true,
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    belt: "Brown",
    color: "#8B6F47",
    birthday: "1995-03-10",
    registry: "987656",
    trainingSince: "2022-09-01",
    isActive: false,
  },
];

export const handlers = [
  http.get(`${API_BASE_URL}/students`, () => {
    return HttpResponse.json(mockStudents);
  }),

  http.get(`${API_BASE_URL}/students/:id`, ({ params }) => {
    const student = mockStudents.find((s) => s.id === params.id);
    if (!student) {
      return HttpResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(student);
  }),

  http.post(`${API_BASE_URL}/students`, async ({ request }) => {
    const body = (await request.json()) as Omit<Student, "id">;
    const newStudent: Student = {
      id: String(Math.random()),
      ...body,
    };
    mockStudents.push(newStudent);
    return HttpResponse.json(newStudent, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/students/:id`, async ({ params, request }) => {
    const student = mockStudents.find((s) => s.id === params.id);
    if (!student) {
      return HttpResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }
    const body = (await request.json()) as Partial<Student>;
    Object.assign(student, body);
    return HttpResponse.json(student);
  }),

  http.delete(`${API_BASE_URL}/students/:id`, ({ params }) => {
    const index = mockStudents.findIndex((s) => s.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }
    mockStudents.splice(index, 1);
    return HttpResponse.json({ message: "Student deleted" });
  }),

  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const { registry, password } = (await request.json()) as {
      registry: string;
      password: string;
    };

    // Mock de validação simples
    if (registry === "2024010" && password === "senha123") {
      return HttpResponse.json({
        token: "mock-jwt-token-12345",
        user: {
          id: "1",
          name: "João das Neves",
          registry: "2024010",
          email: "joao@email.com",
          role: "student",
        },
      });
    }

    if (registry === "admin" && password === "admin123") {
      return HttpResponse.json({
        token: "mock-jwt-token-admin",
        user: {
          id: "2",
          name: "Administrador",
          registry: "admin",
          email: "admin@mestrekame.com",
          role: "admin",
        },
      });
    }

    return HttpResponse.json(
      { message: "Matrícula ou senha inválidos" },
      { status: 401 },
    );
  }),
];
