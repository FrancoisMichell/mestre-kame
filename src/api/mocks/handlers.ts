import { http, HttpResponse } from "msw";
import type { Student } from "../../components/student/StudentTypes";
import type { Class } from "../../components/class/ClassTypes";
import type {
  ClassSession,
  CreateClassSessionDto,
  UpdateClassSessionDto,
} from "../../components/session/SessionTypes";

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

  // ==================== CLASS SESSIONS ENDPOINTS ====================

  // GET /class-sessions - List all sessions with filters
  http.get(`${API_BASE_URL}/class-sessions`, ({ request }) => {
    const url = new URL(request.url);
    const classId = url.searchParams.get("classId");
    const teacherId = url.searchParams.get("teacherId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const isActive = url.searchParams.get("isActive");

    let filtered = [...mockSessions];

    if (classId) {
      filtered = filtered.filter((s) => s.classId === classId);
    }
    if (teacherId) {
      filtered = filtered.filter((s) => s.teacherId === teacherId);
    }
    if (isActive !== null) {
      const activeFilter = isActive === "true";
      filtered = filtered.filter((s) => s.isActive === activeFilter);
    }
    if (startDate) {
      filtered = filtered.filter((s) => s.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((s) => s.date <= endDate);
    }

    return HttpResponse.json({
      data: filtered,
      meta: {
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        totalPages: 1,
      },
    });
  }),

  // GET /class-sessions/by-class/:classId
  http.get(`${API_BASE_URL}/class-sessions/by-class/:classId`, ({ params }) => {
    const { classId } = params;
    const sessions = mockSessions.filter((s) => s.classId === classId);
    return HttpResponse.json(sessions);
  }),

  // GET /class-sessions/by-teacher/:teacherId
  http.get(
    `${API_BASE_URL}/class-sessions/by-teacher/:teacherId`,
    ({ params }) => {
      const { teacherId } = params;
      const sessions = mockSessions.filter((s) => s.teacherId === teacherId);
      return HttpResponse.json(sessions);
    },
  ),

  // GET /class-sessions/by-date-range
  http.get(`${API_BASE_URL}/class-sessions/by-date-range`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return HttpResponse.json(
        { message: "startDate and endDate are required" },
        { status: 400 },
      );
    }

    const sessions = mockSessions.filter(
      (s) => s.date >= startDate && s.date <= endDate,
    );
    return HttpResponse.json(sessions);
  }),

  // GET /class-sessions/:id
  http.get(`${API_BASE_URL}/class-sessions/:id`, ({ params }) => {
    const { id } = params;
    const session = mockSessions.find((s) => s.id === id);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(session);
  }),

  // POST /class-sessions
  http.post(`${API_BASE_URL}/class-sessions`, async ({ request }) => {
    const body = (await request.json()) as CreateClassSessionDto;

    // Find the class to get default times if not provided
    const classData = mockClasses.find((c) => c.id === body.classId);

    let defaultStartTime = "09:00";
    let defaultEndTime = "10:30";

    if (classData) {
      defaultStartTime = classData.startTime;
      // Calculate end time based on start time + duration
      const [hours, minutes] = classData.startTime.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(
        startDate.getTime() + classData.durationMinutes * 60000,
      );
      defaultEndTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
    }

    const newSession: ClassSession = {
      id: `session-${mockSessions.length + 1}`,
      date: body.date,
      startTime: body.startTime || defaultStartTime,
      endTime: body.endTime || defaultEndTime,
      notes: body.notes,
      classId: body.classId,
      teacherId: body.teacherId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSessions.push(newSession);
    return HttpResponse.json(newSession, { status: 201 });
  }),

  // PATCH /class-sessions/:id
  http.patch(
    `${API_BASE_URL}/class-sessions/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = (await request.json()) as UpdateClassSessionDto;
      const sessionIndex = mockSessions.findIndex((s) => s.id === id);

      if (sessionIndex === -1) {
        return HttpResponse.json(
          { message: "Session not found" },
          { status: 404 },
        );
      }

      mockSessions[sessionIndex] = {
        ...mockSessions[sessionIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json(mockSessions[sessionIndex]);
    },
  ),

  // DELETE /class-sessions/:id
  http.delete(`${API_BASE_URL}/class-sessions/:id`, ({ params }) => {
    const { id } = params;
    const sessionIndex = mockSessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    mockSessions.splice(sessionIndex, 1);
    return HttpResponse.json(null, { status: 204 });
  }),

  // PATCH /class-sessions/:id/activate
  http.patch(`${API_BASE_URL}/class-sessions/:id/activate`, ({ params }) => {
    const { id } = params;
    const session = mockSessions.find((s) => s.id === id);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    session.isActive = true;
    session.updatedAt = new Date().toISOString();
    return HttpResponse.json(session);
  }),

  // PATCH /class-sessions/:id/deactivate
  http.patch(`${API_BASE_URL}/class-sessions/:id/deactivate`, ({ params }) => {
    const { id } = params;
    const session = mockSessions.find((s) => s.id === id);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    session.isActive = false;
    session.updatedAt = new Date().toISOString();
    return HttpResponse.json(session);
  }),

  // PATCH /class-sessions/:id/start
  http.patch(`${API_BASE_URL}/class-sessions/:id/start`, ({ params }) => {
    const { id } = params;
    const session = mockSessions.find((s) => s.id === id);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    const now = new Date();
    session.startedAt = now.toISOString();
    // Update startTime to actual time the session was started
    session.startTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    session.updatedAt = now.toISOString();
    return HttpResponse.json(session);
  }),

  // PATCH /class-sessions/:id/end
  http.patch(`${API_BASE_URL}/class-sessions/:id/end`, ({ params }) => {
    const { id } = params;
    const session = mockSessions.find((s) => s.id === id);

    if (!session) {
      return HttpResponse.json(
        { message: "Session not found" },
        { status: 404 },
      );
    }

    const now = new Date();
    session.endedAt = now.toISOString();
    // Update endTime to actual time the session was ended
    session.endTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    session.updatedAt = now.toISOString();
    return HttpResponse.json(session);
  }),
];

// Mock data for class-student enrollments
const classEnrollments: Record<string, string[]> = {
  "1": ["1", "2"], // Class 1 has students 1 and 2
  "2": ["3"], // Class 2 has student 3
  "3": ["1"], // Class 3 has student 1
};

// Mock data for class sessions
const mockSessions: ClassSession[] = [
  {
    id: "session-1",
    date: "2026-02-10",
    startTime: "18:30",
    endTime: "20:00",
    notes: "Trabalhar no triângulo e raspagens",
    classId: "1",
    teacherId: "teacher-1",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "session-2",
    date: "2026-02-12",
    startTime: "18:30",
    endTime: "20:00",
    classId: "1",
    teacherId: "teacher-1",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "session-3",
    date: "2026-02-08",
    startTime: "09:00",
    endTime: "10:30",
    notes: "Aula de hoje",
    classId: "2",
    teacherId: "teacher-1",
    isActive: true,
    startedAt: "2026-02-08T09:05:00Z",
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-08T09:05:00Z",
  },
  {
    id: "session-4",
    date: "2026-02-07",
    startTime: "09:00",
    endTime: "10:30",
    classId: "2",
    teacherId: "teacher-1",
    isActive: true,
    startedAt: "2026-02-07T09:00:00Z",
    endedAt: "2026-02-07T10:35:00Z",
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-07T10:35:00Z",
  },
  {
    id: "session-5",
    date: "2026-02-09",
    startTime: "14:00",
    endTime: "15:30",
    notes: "Aula de amanhã",
    classId: "3",
    teacherId: "teacher-1",
    isActive: true,
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
];
