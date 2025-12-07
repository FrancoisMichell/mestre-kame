// Arquivo para centralizar as definições de endpoints da API
// Útil para manutenção e evitar duplicação de URLs

export const ENDPOINTS = {
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students",
    GET_BY_ID: (id: string) => `/students/${id}`,
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
  },
} as const;
