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
  {
    id: "4",
    name: "Ana Paula Rodrigues",
    belt: "yellow",
    color: "#fbbf24",
    birthday: "2002-11-22",
    registry: "987657",
    trainingSince: "2024-02-01",
    isActive: true,
  },
  {
    id: "5",
    name: "Pedro Henrique Costa",
    belt: "green",
    color: "#10b981",
    birthday: "1999-07-08",
    registry: "987658",
    trainingSince: "2023-09-15",
    isActive: true,
  },
  {
    id: "6",
    name: "Juliana Ferreira",
    belt: "orange",
    color: "#f97316",
    birthday: "2001-04-18",
    registry: "987659",
    trainingSince: "2023-11-20",
    isActive: true,
  },
  {
    id: "7",
    name: "Rafael Martins",
    belt: "white",
    color: "#E5E7EB",
    birthday: "2003-01-30",
    registry: "987660",
    trainingSince: "2024-03-05",
    isActive: true,
  },
  {
    id: "8",
    name: "Fernanda Lima",
    belt: "blue",
    color: "#2563eb",
    birthday: "1997-09-12",
    registry: "987661",
    trainingSince: "2023-04-10",
    isActive: true,
  },
  {
    id: "9",
    name: "Lucas Almeida",
    belt: "black",
    color: "#1f2937",
    birthday: "1994-06-25",
    registry: "987662",
    trainingSince: "2020-01-15",
    isActive: true,
  },
  {
    id: "10",
    name: "Beatriz Souza",
    belt: "green",
    color: "#10b981",
    birthday: "2000-12-05",
    registry: "987663",
    trainingSince: "2023-07-20",
    isActive: true,
  },
  {
    id: "11",
    name: "Gabriel Nascimento",
    belt: "yellow",
    color: "#fbbf24",
    birthday: "2002-03-14",
    registry: "987664",
    trainingSince: "2024-01-25",
    isActive: false,
  },
  {
    id: "12",
    name: "Camila Pereira",
    belt: "brown",
    color: "#8B6F47",
    birthday: "1996-10-08",
    registry: "987665",
    trainingSince: "2022-05-12",
    isActive: true,
  },
  {
    id: "13",
    name: "Thiago Barbosa",
    belt: "orange",
    color: "#f97316",
    birthday: "2001-08-19",
    registry: "987666",
    trainingSince: "2023-10-30",
    isActive: true,
  },
  {
    id: "14",
    name: "Larissa Mendes",
    belt: "white",
    color: "#E5E7EB",
    birthday: "2004-02-28",
    registry: "987667",
    trainingSince: "2024-02-15",
    isActive: true,
  },
  {
    id: "15",
    name: "Felipe Carvalho",
    belt: "blue",
    color: "#2563eb",
    birthday: "1998-05-17",
    registry: "987668",
    trainingSince: "2023-03-08",
    isActive: true,
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

  http.get(`${API_BASE_URL}/students`, ({ request }) => {
    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get("isActive");

    // Filter by isActive if parameter is provided
    let filteredStudents = mockStudents;
    if (isActiveParam !== null) {
      const isActive = isActiveParam === "true";
      filteredStudents = mockStudents.filter((s) => s.isActive === isActive);
    }

    return HttpResponse.json({
      data: filteredStudents,
      meta: {
        total: filteredStudents.length,
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

  http.patch(`${API_BASE_URL}/students/:id`, async ({ params, request }) => {
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

  http.post(`${API_BASE_URL}/teacher/login`, async ({ request }) => {
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
          belt: "white",
          isActive: true,
          roles: [
            {
              id: "role-1",
              role: "student",
            },
          ],
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
          belt: "black",
          isActive: true,
          roles: [
            {
              id: "role-2",
              role: "teacher",
            },
          ],
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

  http.get(`${API_BASE_URL}/classes/:id`, ({ params }) => {
    const { id } = params;
    const classItem = mockClasses.find((c) => c.id === id);

    if (!classItem) {
      return HttpResponse.json(
        { message: "Turma não encontrada" },
        { status: 404 },
      );
    }

    return HttpResponse.json(classItem);
  }),

  http.post(`${API_BASE_URL}/classes`, async ({ request }) => {
    const body = (await request.json()) as Partial<Class>;

    const newClass: Class = {
      id: String(mockClasses.length + 1),
      name: body.name || "",
      days: body.days || [],
      startTime: body.startTime || "",
      durationMinutes: body.durationMinutes || 60,
      isActive: true,
      teacher: {
        id: "teacher-1",
        name: "Sensei Yamamoto",
        email: "yamamoto@mestrekame.com",
      },
    };

    mockClasses.push(newClass);
    return HttpResponse.json(newClass, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/classes/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Class>;
    const index = mockClasses.findIndex((c) => c.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Turma não encontrada" },
        { status: 404 },
      );
    }

    mockClasses[index] = {
      ...mockClasses[index],
      ...body,
    };

    return HttpResponse.json(mockClasses[index]);
  }),

  http.delete(`${API_BASE_URL}/classes/:id`, ({ params }) => {
    const { id } = params;
    const index = mockClasses.findIndex((c) => c.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Turma não encontrada" },
        { status: 404 },
      );
    }

    mockClasses.splice(index, 1);
    return HttpResponse.json({ message: "Turma excluída com sucesso" });
  }),

  // ==================== CLASS-STUDENTS ENDPOINTS ====================

  // GET /classes/:id/students - List enrolled students with filters
  http.get(`${API_BASE_URL}/classes/:id/students`, ({ request, params }) => {
    const { id } = params;
    const url = new URL(request.url);

    // Check if class exists
    const classExists = mockClasses.find((c) => c.id === id);
    if (!classExists) {
      return HttpResponse.json(
        { message: "Turma não encontrada" },
        { status: 404 },
      );
    }

    // Get enrolled student IDs
    const enrolledIds = classEnrollments[id as string] || [];

    // Filter students by enrolled IDs
    let filteredStudents = mockStudents.filter((s) =>
      enrolledIds.includes(s.id),
    );

    // Apply filters
    const nameFilter = url.searchParams.get("name");
    const registryFilter = url.searchParams.get("registry");
    const beltFilter = url.searchParams.get("belt");

    if (nameFilter) {
      filteredStudents = filteredStudents.filter((s) =>
        s.name.toLowerCase().includes(nameFilter.toLowerCase()),
      );
    }
    if (registryFilter) {
      filteredStudents = filteredStudents.filter((s) =>
        s.registry?.includes(registryFilter),
      );
    }
    if (beltFilter) {
      filteredStudents = filteredStudents.filter((s) => s.belt === beltFilter);
    }

    // Apply sorting
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "ASC";

    filteredStudents.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "registry") {
        comparison = (a.registry || "").localeCompare(b.registry || "");
      } else if (sortBy === "belt") {
        const beltOrder = [
          "white",
          "yellow",
          "orange",
          "green",
          "blue",
          "brown",
          "black",
        ];
        comparison = beltOrder.indexOf(a.belt) - beltOrder.indexOf(b.belt);
      }
      return sortOrder === "DESC" ? -comparison : comparison;
    });

    // Apply pagination
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedStudents,
      meta: {
        total: filteredStudents.length,
        page,
        limit,
        totalPages: Math.ceil(filteredStudents.length / limit),
      },
    });
  }),

  // POST /classes/:classId/enroll/:studentId - Enroll a student
  http.post(
    `${API_BASE_URL}/classes/:classId/enroll/:studentId`,
    ({ params }) => {
      const { classId, studentId } = params;

      // Check if class exists
      const classExists = mockClasses.find((c) => c.id === classId);
      if (!classExists) {
        return HttpResponse.json(
          { message: "Turma não encontrada" },
          { status: 404 },
        );
      }

      // Check if student exists
      const studentExists = mockStudents.find((s) => s.id === studentId);
      if (!studentExists) {
        return HttpResponse.json(
          { message: "Aluno não encontrado" },
          { status: 404 },
        );
      }

      // Initialize enrollment array if doesn't exist
      if (!classEnrollments[classId as string]) {
        classEnrollments[classId as string] = [];
      }

      // Check if already enrolled
      if (classEnrollments[classId as string].includes(studentId as string)) {
        return HttpResponse.json(
          { message: "Aluno já está matriculado nesta turma" },
          { status: 400 },
        );
      }

      // Enroll student
      classEnrollments[classId as string].push(studentId as string);

      return HttpResponse.json({
        message: "Aluno matriculado com sucesso",
        data: studentExists,
      });
    },
  ),

  // DELETE /classes/:classId/enroll/:studentId - Unenroll a student
  http.delete(
    `${API_BASE_URL}/classes/:classId/enroll/:studentId`,
    ({ params }) => {
      const { classId, studentId } = params;

      // Check if class exists
      const classExists = mockClasses.find((c) => c.id === classId);
      if (!classExists) {
        return HttpResponse.json(
          { message: "Turma não encontrada" },
          { status: 404 },
        );
      }

      // Check if enrollment exists
      if (!classEnrollments[classId as string]) {
        return HttpResponse.json(
          { message: "Aluno não está matriculado nesta turma" },
          { status: 404 },
        );
      }

      const enrollmentIndex = classEnrollments[classId as string].indexOf(
        studentId as string,
      );
      if (enrollmentIndex === -1) {
        return HttpResponse.json(
          { message: "Aluno não está matriculado nesta turma" },
          { status: 404 },
        );
      }

      // Unenroll student
      classEnrollments[classId as string].splice(enrollmentIndex, 1);

      return HttpResponse.json({
        message: "Aluno removido da turma com sucesso",
      });
    },
  ),
];

// Mock data for class-student enrollments
const classEnrollments: Record<string, string[]> = {
  "1": ["1", "2"], // Class 1 has students 1 and 2
  "2": ["3"], // Class 2 has student 3
  "3": ["1"], // Class 3 has student 1
};
