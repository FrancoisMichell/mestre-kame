// Arquivo para centralizar as definições de endpoints da API
// Útil para manutenção e evitar duplicação de URLs

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/teacher/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students",
    GET_BY_ID: (id: string) => `/students/${id}`,
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
  },
  CLASSES: {
    LIST: "/classes",
    CREATE: "/classes",
    GET_BY_ID: (id: string) => `/classes/${id}`,
    UPDATE: (id: string) => `/classes/${id}`,
    DELETE: (id: string) => `/classes/${id}`,
    GET_STUDENTS: (id: string) => `/classes/${id}/students`,
    ENROLL_STUDENT: (classId: string, studentId: string) =>
      `/classes/${classId}/enroll/${studentId}`,
    UNENROLL_STUDENT: (classId: string, studentId: string) =>
      `/classes/${classId}/enroll/${studentId}`,
  },
  CLASS_SESSIONS: {
    LIST: "/class-sessions",
    CREATE: "/class-sessions",
    GET_BY_ID: (id: string) => `/class-sessions/${id}`,
    UPDATE: (id: string) => `/class-sessions/${id}`,
    DELETE: (id: string) => `/class-sessions/${id}`,
    ACTIVATE: (id: string) => `/class-sessions/${id}/activate`,
    DEACTIVATE: (id: string) => `/class-sessions/${id}/deactivate`,
    START: (id: string) => `/class-sessions/${id}/start`,
    END: (id: string) => `/class-sessions/${id}/end`,
    BY_CLASS: (classId: string) => `/class-sessions/by-class/${classId}`,
    BY_TEACHER: (teacherId: string) =>
      `/class-sessions/by-teacher/${teacherId}`,
    BY_DATE_RANGE: "/class-sessions/by-date-range",
  },
} as const;
