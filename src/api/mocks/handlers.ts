import { http, HttpResponse } from "msw";
import type { Student } from "../../components/student/StudentTypes";
import type { Class } from "../../components/class/ClassTypes";

const API_BASE_URL = "http://localhost:3000";

const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    belt: "white",
    color: "#E5E7EB",
    birthday: "2000-05-15",
    registry: "987654",
    trainingSince: "2024-01-10",
    isActive: true,
  },
  {
    id: "2",
    name: "Maria Santos",
    belt: "blue",
    color: "#2563eb",
    birthday: "1998-08-20",
    registry: "987655",
    trainingSince: "2023-06-15",
    isActive: true,
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    belt: "brown",
    color: "#8B6F47",
    birthday: "1995-03-10",
    registry: "987656",
    trainingSince: "2022-09-01",
    isActive: false,
  },
];

const mockClasses: Class[] = [
  {
    id: "1",
    name: "Iniciantes - 18h",
    days: [1, 3, 5], // Segunda, Quarta, Sexta
    startTime: "18:00",
    durationMinutes: 60,
    isActive: true,
    teacher: {
      id: "teacher-1",
      name: "Sensei Yamamoto",
      email: "yamamoto@mestrekame.com",
    },
  },
  {
    id: "2",
    name: "Avançados - 19h",
    days: [2, 4], // Terça, Quinta
    startTime: "19:00",
    durationMinutes: 90,
    isActive: true,
    teacher: {
      id: "teacher-2",
      name: "Sensei Tanaka",
      email: "tanaka@mestrekame.com",
    },
  },
  {
    id: "3",
    name: "Crianças - 16h",
    days: [1, 2, 3, 4, 5], // Segunda a Sexta
    startTime: "16:00",
    durationMinutes: 45,
    isActive: true,
    teacher: {
      id: "teacher-1",
      name: "Sensei Yamamoto",
      email: "yamamoto@mestrekame.com",
    },
  },
];

export const handlers = [
  // TESTE DE SESSÃO EXPIRADA (401):
  // Descomente a linha abaixo para simular token expirado ao buscar estudantes
  // http.get(`${API_BASE_URL}/students`, () => {
  //   return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }),

  http.get(`${API_BASE_URL}/students`, () => {
    return HttpResponse.json({
      data: mockStudents,
      meta: {
        total: mockStudents.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
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

  // ==================== CLASSES ====================
  http.get(`${API_BASE_URL}/classes`, () => {
    return HttpResponse.json({
      data: mockClasses,
      meta: {
        total: mockClasses.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  }),
];
